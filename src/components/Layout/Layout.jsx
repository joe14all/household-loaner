import React from 'react';
import styles from './Layout.module.css';
import Sidebar from '../Sidebar/Sidebar.jsx'; // We will create this component next

/**
 * The main application layout.
 * Renders the persistent Sidebar and the main content area for pages.
 * @param {object} props
 * @param {React.ReactNode} props.children - The page component from AppRouter.
 */
const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;