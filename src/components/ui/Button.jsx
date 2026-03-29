import './Button.css';

/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'yellow' | 'outline'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full' : '',
        loading ? 'btn--loading' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : (
        <>
          {icon && <span className="btn__icon btn__icon--left">{icon}</span>}
          <span className="btn__label">{children}</span>
          {iconRight && <span className="btn__icon btn__icon--right">{iconRight}</span>}
        </>
      )}
    </button>
  );
}