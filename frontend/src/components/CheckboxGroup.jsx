
function CheckboxGroup({ title, name, options, values, limit, onToggle }) {
    return (
        <div className="box_select">
            <h3 className="gradient">{title}</h3>
            <ul className="list">
                {options.map(op => (
                    <li key={op}>
                        {op}
                        <input
                            type="checkbox"
                            value={op}
                            checked={values.includes(op)}
                            onChange={(e) => onToggle(e, name, limit)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckboxGroup;
