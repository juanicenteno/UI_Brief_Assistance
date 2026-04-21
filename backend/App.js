const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const pool = require("./db");
const fs = require("fs");
const path = require("path");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- GROQ: genera el brief en JSON ---
async function generateBriefGroq(systemPrompt, userPrompt) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// --- POLLINATIONS: genera una imagen con FLUX, sin token ni cuenta ---
async function generateImage(prompt) {
    const encoded = encodeURIComponent(prompt);
    const response = await fetch(
        `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true`,
        { method: "GET" }
    );

    if (!response.ok) {
        throw new Error(`Pollinations error ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

app.post('/api/generar', async (req, res) => {
    const { idea, industria, personalidad, comunicacion, estilo, publico, diferencial } = req.body;

    if (!idea || !industria) {
        return res.status(400).json({ error: "Los campos 'idea' e 'industria' son obligatorios." });
    }

    console.log("📥 Datos recibidos:", req.body);

    const systemPrompt = `Sos un Diseñador UX Senior y Director de Branding con enfoque estratégico, creativo y orientado al detalle. Tu tarea es crear un brief creativo completo y con personalidad basado en los datos del usuario.

REQUISITOS IMPORTANTES:
- El resultado debe ser EXCLUSIVAMENTE un JSON válido. NO incluyas texto fuera del JSON.
- Todos los textos dentro del JSON deben estar en español (excepto los prompts de imágenes).
- Los textos deben ser creativos, concretos y NO genéricos.
- El nombre del proyecto debe ser llamativo y original.
- Los textos del 'logo_prompt' y 'mockup_prompt' deben estar en INGLÉS e incluir la paleta de colores.

GUÍA DE ESTILO:
- Tono creativo, profesional y con identidad propia.
- Evitá frases vacías como "experiencia moderna" o "soluciones innovadoras".
- Usá detalles sensoriales y narrativas persuasivas.

FORMATO EXACTO DEL JSON A ENTREGAR:
{
  "name": "Nombre creativo del proyecto",
  "description": "Descripción del negocio con tono creativo y clara",
  "colors": [
    { "hex": "#HEX", "name": "Nombre del color", "role": "Uso del color" }
  ],
  "fonts": [
    { "font": "Nombre de la fuente", "url": "https://...", "usage": "para títulos o cuerpo" }
  ],
  "persona": {
    "name": "Nombre",
    "age": 30,
    "sex": "masculino o femenino",
    "country": "país de nacimiento",
    "education": "nivel educativo",
    "situacion": "soltero/a o casado/a",
    "ocupation": "posición laboral actual",
    "hijos": 0,
    "motivations": ["Motivación 1", "Motivación 2"],
    "frustrations": ["Frustración 1", "Frustración 2"],
    "description": "Breve pero potente descripción psicológica del usuario"
  },
  "logo_prompt": "Prompt corto en inglés para generar el logo",
  "mockup_prompt": "Prompt corto en inglés para generar mockups realistas"
}`;

    const userPrompt = `Por favor, genera el brief basado en lo siguiente:
- Idea del negocio: "${idea}"
- Industria: ${industria}
- Personalidad: ${JSON.stringify(personalidad)}
- Comunicación: ${JSON.stringify(comunicacion)} 
- Estilo visual deseado: ${JSON.stringify(estilo)}
- Público objetivo: ${JSON.stringify(publico)}
- Diferencial: ${diferencial}`;

    try {
        // --- PASO 1: BRIEF CON GROQ ---
        console.log("🧠 Generando brief con Groq...");
        const rawContent = await generateBriefGroq(systemPrompt, userPrompt);
        console.log("🧾 Brief recibido:\n", rawContent);

        let brief;
        try {
            brief = JSON.parse(rawContent);
        } catch (parseError) {
            console.error("❌ Error al parsear JSON:", parseError);
            return res.status(500).json({ error: "La respuesta de la IA no es un JSON válido.", rawContent });
        }

        // --- PASO 2: IMÁGENES CON POLLINATIONS ---
        console.log("🎨 Generando imágenes con Pollinations...");

        // ✅ DESPUÉS - en secuencia, con una pequeña pausa entre medio
        const logoBuffer = await generateImage(brief.logo_prompt);
        await new Promise(r => setTimeout(r, 3000)); // espera 3 segundos
        const mockupBuffer = await generateImage(brief.mockup_prompt);

        const logoFilename = `logo_${Date.now()}.png`;
        const mockupFilename = `mockup_${Date.now()}.png`;

        fs.writeFileSync(path.join(uploadDir, logoFilename), logoBuffer);
        fs.writeFileSync(path.join(uploadDir, mockupFilename), mockupBuffer);

        console.log(`✅ Imágenes guardadas: ${logoFilename}, ${mockupFilename}`);

        brief.logo_url = `/uploads/${logoFilename}`;
        brief.mockup_url = `/uploads/${mockupFilename}`;

        // --- PASO 3: GUARDAR EN DB ---
        const id = crypto.randomUUID();

        await pool.query(
            "INSERT INTO briefs (id, data) VALUES (?, ?)",
            [id, JSON.stringify(brief)]
        );

        res.json({ id, brief });

    } catch (error) {
        console.error("❌ Error general:", error.message);
        res.status(500).json({ error: error.message || 'Error generando brief con IA' });
    }
});

app.get('/api/generar-pdf', async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Falta el ID");
    }

    let browser;
    try {
        const [rows] = await pool.query("SELECT id FROM briefs WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).send("No se encontró el brief");
        }

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);

        page.on("console", (msg) => {
            console.log("🖥️ [frontend]", msg.text());
        });
        page.on("pageerror", (err) => {
            console.error("🧨 [frontend error]", err.message);
        });

        await page.goto(`http://localhost:5173/resultado?id=${id}`, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });
        
        // Modo "como imprimir en navegador": da tiempo a hidratar/fetch y sigue.
        await page.waitForSelector("body", { timeout: 15000 });
        await page.waitForFunction(() => document.readyState === "complete", { timeout: 15000 });
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Hace match visual con la vista de pantalla del navegador.
        await page.emulateMediaType("screen");

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "12mm",
                right: "10mm",
                bottom: "12mm",
                left: "10mm",
            },
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="brief-${id}.pdf"`
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error("❌ Error al generar PDF:", error);
        res.status(500).send("Error interno al generar el PDF");
    } finally {
        if (browser) await browser.close();
    }
});

app.get('/api/brief/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT data FROM briefs WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(JSON.parse(rows[0].data));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});