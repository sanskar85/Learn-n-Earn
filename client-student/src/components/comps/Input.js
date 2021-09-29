
export const SelectInput = ({ className, options,disabled, optionClass, name, selectChangeHandler }) => {
    return (
        <select className={className} name={name} onChange={selectChangeHandler} disabled={disabled}>
            {options.map((opt, index) => {
                return (<option key={index} className={optionClass}>{opt}</option>);
            })}
        </select>
    );

}
export const LabelledSelectInput = ({ labelClassName, labelText, className, styles, required, options, optionClass, name, selectChangeHandler }) => {

    if (required === name) {
        styles = { ...styles, border: "0.1px solid red" };
    }
    return (<>
        <label htmlFor="" className={labelClassName}>{labelText}</label>
        <select className={className} name={name} style={styles} onChange={selectChangeHandler}
            required={true} >
            {options.map((opt, index) => {
                return (<option key={index} className={optionClass}>{opt}</option>);
            })}
        </select>
    </>);

}
export const TextInput = ({ className, name, type, value,disabled, textChangeHandler, placeholder, styles }) => {
    return (
        <input
            style={styles}
            type={type}
            className={className}
            name={name}
            value={value}
            onChange={textChangeHandler}
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
        />
    );

}
export const LabelledInput = ({ labelClassName, className, name, required,
    type, labelText, value, textChangeHandler,
    placeholder, styles, disabled = false,max }) => {
    if (required === name) {
        styles = { ...styles, border: "0.1px solid red" };
    }
    return (<>
        <label htmlFor="" className={labelClassName}>{labelText}</label>
        <input
            required={true}
            disabled={disabled}
            style={styles}
            type={type}
            className={className}
            name={name}
            max={max}
            value={value}
            step="0.01"
            onChange={textChangeHandler}
            placeholder={placeholder}
            autoComplete="off"
        />
    </>);

}


export const Button = ({ className, name, type, value, clickHandler }) => {
    return (
        <button
            type={type}
            className={className}
            name={name}
            value={value}
            onClick={clickHandler}
        >{value}</button>
    );

}