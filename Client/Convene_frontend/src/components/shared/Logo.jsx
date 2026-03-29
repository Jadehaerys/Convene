import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';
import './Logo.css';

/**
 * variant: 'dark' | 'light'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Logo({ variant = 'dark', size = 'md' }) {
  const src = variant === 'light' ? logoLight : logoDark;
  return (
    <div className={`logo logo--${size}`}>
      <img src={src} alt="Convene" className="logo__img" />
    </div>
  );
}
