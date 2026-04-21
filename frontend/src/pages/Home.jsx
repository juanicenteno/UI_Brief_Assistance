import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import IdeaInput from "../components/IdeaInput";
import IndustriaSelect from "../components/IndustrySelect";
import CheckboxGroup from "../components/CheckboxGroup";
import DiferencialInput from "../components/DiferencialInput";
import HowItWorks from "../components/HowItWorks";
import Wait from "../components/Wait";

const personalityOptions = [
    "Profesional", "Divertida", "Minimalista", "Rebelde",
    "Elegante", "Tradicional", "Creativa", "Premium"
];
const comunicationOptions = [
    "Cercano", "Inspirador", "Técnico", "Humorístico",
    "Formal", "Aspiracional"
];
const visualStyleOptions = [
    "Moderno", "Minimalista", "Futurista", "Clásico",
    "Artesanal", "Elegante", "Lúdico", "Tecnológico"
];
const publicOptions = [
    "Jóvenes", "Adultos", "Niños", "Adolescentes", "Ancianos"
];

function Home() {
    const [formData, setFormData] = useState({
        idea: "",
        industria: "",
        personalidad: [],
        comunicacion: [],
        estilo: [],
        publico: [],
        diferencial: ""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (e, field, limit) => {
        const { checked, value } = e.target;

        setFormData(prev => {
            const arr = prev[field];

            if (checked) {
                if (arr.length >= limit) return prev;
                return { ...prev, [field]: [...arr, value] };
            }
            return { ...prev, [field]: arr.filter(x => x !== value) };
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:4000/api/generar", formData);
            navigate("/resultado", { state: response.data });
        } catch (err) {
            console.error(err);
            setError("Ocurrió un error al generar el brief.");
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div id="container">
            <section className="home-hero">
                <p className="hero-badge">Asistente de branding con IA</p>
                <h2 className="home-hero-title">
                    Crea un brief de marca completo en minutos
                </h2>
                <p className="home-hero-subtitle">
                    Definí tu idea, elegí el tono de tu marca y obtené una propuesta visual lista para presentar.
                </p>
                <div className="hero-metrics">
                    <span>Brief creativo</span>
                    <span>Paleta + tipografías</span>
                    <span>User persona</span>
                </div>
            </section>

            <section className="home-content">
                <HowItWorks />

                <form className="build-project" onSubmit={handleSubmit}>
                    <div className="form-card">
                        <IdeaInput
                            value={formData.idea}
                            onChange={handleChange}
                        />
                        <div className="container_check">
                            <IndustriaSelect
                                value={formData.industria}
                                onChange={handleChange}
                            />

                            <CheckboxGroup
                                title="Personalidad de tu marca"
                                name="personalidad"
                                options={personalityOptions}
                                values={formData.personalidad}
                                limit={3}
                                onToggle={handleCheckbox}
                            />
                            <CheckboxGroup
                                title="¿QUE QUIERES COMUNICAR?"
                                name="comunicacion"
                                options={comunicationOptions}
                                values={formData.comunicacion}
                                limit={2}
                                onToggle={handleCheckbox}
                            />
                            <CheckboxGroup
                                title="ELIGE TU ESTILO"
                                name="estilo"
                                options={visualStyleOptions}
                                values={formData.estilo}
                                limit={2}
                                onToggle={handleCheckbox}
                            />
                            <CheckboxGroup
                                title="ELIGE TU PUBLICO"
                                name="publico"
                                options={publicOptions}
                                values={formData.publico}
                                limit={3}
                                onToggle={handleCheckbox}
                            />

                            <DiferencialInput
                                value={formData.diferencial}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button className="button-submit" type="submit">
                        Generar propuesta de marca
                    </button>
                    {error && <p className="error">{error}</p>}
                </form>
            </section>

            {loading && <Wait />}
        </div>
    );
}

export default Home;
