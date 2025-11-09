import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

/**
 * The persistent navigation sidebar for the application.
 */
const Sidebar = () => {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logo}>
        HouseholdLoaner
      </div>
      
      <nav className={styles.nav}>
        {/* NavLink is used for navigation.
            It gets a special 'active' class when its 'to' prop
            matches the current URL.
        */}
        <NavLink
          to="/"
          // We check the 'isActive' state to apply our CSS module class
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Dashboard
        </NavLink>
        
        <NavLink
          to="/add-loan"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Add New Loan
        </NavLink>
        
        {/* You could add more links here later, e.g., for a Settings page */}
        {/*
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          Settings
        </NavLink>
        */}
      </nav>
    </aside>
  );
};

export default Sidebar;