import styles from './Button.module.css';

/**
 * Reusable button.
 * variant: 'primary' (dark), 'outline' (white with border), 'link' (accent text)
 * Every other prop (onClick, disabled, aria-label, type...) is passed through to <button>.
 */
function Button({ variant = 'outline', className = '', type = 'button', children, ...rest }) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
