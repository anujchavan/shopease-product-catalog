import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/Header/Header';
import PageLoader from '@/components/common/PageLoader/PageLoader';
import styles from './Layout.module.css';

/** Shared page shell: header on every page; the current page renders in <Outlet />. */
function Layout() {
  return (
    <div className={styles.app}>
      {/* Lets keyboard users jump past the header straight to the content */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        {/* Shows a loader while a lazy-loaded page's code is downloading */}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Restores scroll position on Back, scrolls to top on new pages */}
      <ScrollRestoration />
    </div>
  );
}

export default Layout;
