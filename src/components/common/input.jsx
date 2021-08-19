import React from 'react';

const Input = ({name, label, value, onChange, type, error}) => {
    return (
        <div className="mb-3">
            <label htmlFor={name} className="form-label">{label}</label>
            <input value={value} name={name}
                   onChange={onChange} type={type}
                   className="form-control rounded-1" autoFocus
                   id={name}/>
            {error && <div className="form-text text-danger">{error}</div>}
        </div>
    );
};
Input.defaultProps = {
    type: "text"
}
export default Input;