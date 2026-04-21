function IdeaInput({ value, onChange }) {
    return (
        <div className="textarea-submit">
             <h3 className="gradient">¿Qué creamos hoy?</h3>
            <textarea
                placeholder="Ej: Una plataforma de IA que genera planes de marketing personalizados..."
                name="idea"
                value={value}
                onChange={onChange}
                rows={3}
                required
            />
        </div>
    );
}

export default IdeaInput;
