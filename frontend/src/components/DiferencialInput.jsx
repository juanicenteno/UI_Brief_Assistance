function DiferencialInput({ value, onChange }) {
    return (
        <div className="input_diferencial">
            <h3 className="gradient">¿Qué te diferencia del resto?</h3>
            <input
                type="text"
                name="diferencial"
                placeholder="la primera Web App de generación de marcas..."
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default DiferencialInput;
