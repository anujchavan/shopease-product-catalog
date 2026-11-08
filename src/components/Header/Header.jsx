import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Going to "/" with no query params also resets search and filters */}
        <Link to="/" className={styles.logo} aria-label="ShopEase home">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          <span className={styles.wordmark}>ShopEase</span>
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
