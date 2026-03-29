import './Input.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  iconRight,
  error,
  hint,
  required = false,
  disabled = false,
  name,
  id,
  autoComplete,
  className = '',
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${disabled ? 'input-field--disabled' : ''} ${className}`}>
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      <div className="input-field__wrap">
        {icon && <span className="input-field__icon input-field__icon--left">{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={[
            'input-field__input',
            icon ? 'has-icon-left' : '',
            iconRight ? 'has-icon-right' : '',
          ].filter(Boolean).join(' ')}
        />
        {iconRight && <span className="input-field__icon input-field__icon--right">{iconRight}</span>}
      </div>
      {error  && <p className="input-field__error">{error}</p>}
      {hint && !error && <p className="input-field__hint">{hint}</p>}
    </div>
  );
}