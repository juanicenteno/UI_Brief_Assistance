const INDUSTRIAS = ["Tecnología", "Comida", "Moda", "Salud", "Educación"];

function IndustriaSelect({ value, onChange }) {
    return (
        <div className="box_select">
            <h3 className="gradient">¿A QUE INDUSTRIA PERTENECES?</h3>
            <ul className="list">
                {INDUSTRIAS.map(item => (
                    <li key={item}>
                        {item}
                        <input
                            type="radio"
                            name="industria"
                            value={item}
                            checked={value === item}
                            onChange={onChange}
                            required
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default IndustriaSelect;
