import React from 'react';
import styles from './Layout.module.css';


/**
 * The main application layout.
 * Renders the persistent Sidebar and the main content area for pages.
 * @param {object} props
 * @param {React.ReactNode} props.children - The page component from AppRouter.
 */
const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;