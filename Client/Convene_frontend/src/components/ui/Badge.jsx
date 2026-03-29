import './Badge.css';

/**
 * variant: 'ai' | 'chain' | 'default' | 'success' | 'error' | 'yellow'
 * size: 'sm' | 'md'
 */
export default function Badge({ children, variant = 'default', size = 'sm', dot = false }) {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
}