import "../css/Home.css"
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import flags from 'emoji-flags';
import { useEffect, useState } from "react";
// Accede al emoji o al código


function Result() {
    const [params] = useSearchParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [brief, setBrief] = useState(state?.brief || null);
    const id = state?.id || params.get("id");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Señal por defecto: el contenido aún no está listo para PDF.
        window.__PDF_READY__ = false;
    }, []);

    useEffect(() => {
        // Si no hay state (ej: Puppeteer), busca el brief por ID
        if (!brief && id) {
            fetch(`${import.meta.env.VITE_API_URL}/api/brief/${id}`)
                .then(r => r.json())
                .then(data => setBrief(data))
                .catch(() => navigate('/'));
        }
    }, [brief, id, navigate]);

    useEffect(() => {
        if (!brief?.fonts) return;

        brief.fonts.forEach((f) => {
            const fontNameForURL = f.font.replace(/ /g, "+");
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${fontNameForURL}:ital,wght@0,400;1,400&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        });
    }, [brief]);

    useEffect(() => {
        if (!brief) return;

        // Señal temprana: el contenido textual ya está listo para imprimir.
        window.__PDF_READY__ = true;
    }, [brief]);

    if (!brief) {
        return (
            <div>
                <p>Cargando resultado...</p>
            </div>
        );
    }

    const logoUrl = brief.logo_url;
    const mockupUrl = brief.mockup_url;
    console.log(state);

    const country = flags.data.find(
        (c) => c.name.toLowerCase() === brief.persona.country.toLowerCase()
    );

    const descargarPDF = () => {
        if (!id) {
            alert("No se encontró el ID del brief para generar el PDF.");
            return;
        }
        window.open(`${import.meta.env.VITE_API_URL}/api/generar-pdf?id=${id}`);
    };

    return (
        <div id='result-main'>
            <section className="result-hero-card">
                <p className="result-chip">Brief generado con IA</p>
                <h1 className='result-title gradient'>{brief.name}</h1>
                <p className='result-description'>{brief.description}</p>
            </section>

            <section className="result-section-card">
                <h2 className="gradient">Identidad visual</h2>
                <div className="container_imgs result-images-grid">
                    <figure className="result-image-frame">
                        <img src={`${import.meta.env.VITE_API_URL}${logoUrl}`} alt="Logo de marca" />
                        <figcaption>Logo</figcaption>
                    </figure>
                    <figure className="result-image-frame">
                        <img src={`${import.meta.env.VITE_API_URL}${mockupUrl}`} alt="Mockup de marca" />
                        <figcaption>Mockup</figcaption>
                    </figure>
                </div>
            </section>

            <section className="result-section-card">
                <h2 className="gradient">Tipografías</h2>
                <ul className="list-fonts result-fonts-grid">
                    {brief.fonts.map((t, idx) => (
                        <li key={idx} className="result-font-item">
                            <p className="font-name">{t.font}</p>
                            <p className="font-axample" style={{ fontFamily: `'${t.font}', sans-serif`, fontStyle: "italic" }}>
                                The quick brown fox jumps over the lazy dog
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="result-section-card">
                <h2 className="gradient">Paleta de colores</h2>
                <ul className="paleta-colores result-colors-grid">
                    {brief.colors.map((c, idx) => (
                        <li key={idx}>
                            <div onClick={() => navigator.clipboard.writeText(c.hex)} style={{ backgroundColor: c.hex }}>
                                <span>
                                    <svg className="color-clipboard" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 5.00005C7.01165 5.00082 6.49359 5.01338 6.09202 5.21799C5.71569 5.40973 5.40973 5.71569 5.21799 6.09202C5 6.51984 5 7.07989 5 8.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V8.2C19 7.07989 19 6.51984 18.782 6.09202C18.5903 5.71569 18.2843 5.40973 17.908 5.21799C17.5064 5.01338 16.9884 5.00082 16 5.00005M8 5.00005V7H16V5.00005M8 5.00005V4.70711C8 4.25435 8.17986 3.82014 8.5 3.5C8.82014 3.17986 9.25435 3 9.70711 3H14.2929C14.7456 3 15.1799 3.17986 15.5 3.5C15.8201 3.82014 16 4.25435 16 4.70711V5.00005M12 11H9M15 15H9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> ({c.hex})
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="result-section-card">
                <h2 className="gradient">User Persona</h2>
                <section id="user-persona">
                    <div className="persona-part1">
                        <img
                            src={brief.persona.sex === "masculino" ? "/upm.png" : "/upf.png"}
                            alt="Avatar de user persona"
                            className="persona-avatar"
                        />
                        <p className="persona-name yellow">{brief.persona.name}</p>
                        <p>Edad: <strong>{brief.persona.age}</strong></p>
                        <p>Estudios: <strong>{brief.persona.education}</strong></p>
                        <p>Situación: <strong>{brief.persona.situacion}</strong></p>
                        <p>Ocupación: <strong>{brief.persona.ocupation}</strong></p>
                        <div className="persona-country">
                            <p>País de residencia: {brief.persona.country}</p>
                            {country?.code && (
                                <img
                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                    alt={`Bandera de ${brief.persona.country}`}
                                />
                            )}
                        </div>
                        <p>Hijos: <strong>{brief.persona.hijos}</strong></p>
                        <p className="persona-description">{brief.persona.description}</p>
                    </div>

                    <div className="persona-part2">
                        <ul>
                            <p><strong>Motivaciones</strong></p>
                            {brief.persona.motivations.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                        <ul>
                            <p><strong>Frustraciones</strong></p>
                            {brief.persona.frustrations.map((f, idx) => <li key={idx}>{f}</li>)}
                        </ul>
                    </div>
                </section>
            </section>

            <button className="download-pdf" onClick={descargarPDF}>Descargar PDF</button>
        </div>
    );
}

export default Result;
