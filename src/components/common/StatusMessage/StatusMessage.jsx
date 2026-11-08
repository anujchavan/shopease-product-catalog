import Button from '../Button/Button';
import styles from './StatusMessage.module.css';

/**
 * One panel for both "something went wrong" (type="error") and "nothing found" (type="empty").
 * Pass `onAction` + `actionLabel` to show a button (e.g. Try again, Reset filters).
 */
function StatusMessage({ type = 'empty', title, message, actionLabel, onAction }) {
  const isError = type === 'error';

  return (
    <div className={`${styles.panel} ${styles[type]}`} role={isError ? 'alert' : 'status'}>
      <strong className={styles.title}>{title}</strong>
      {message && <p className={styles.message}>{message}</p>}
      {onAction && (
        <Button variant={isError ? 'primary' : 'outlineInk'} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default StatusMessage;
