import { Link, useLocation } from 'react-router-dom';
import { Camera, Home, History, User, Info } from 'lucide-react';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <Home size={24} />, label: 'Home' },
    { path: '/scan', icon: <Camera size={24} />, label: 'Scan' },
    { path: '/history', icon: <History size={24} />, label: 'History' },
    { path: '/dashboard', icon: <User size={24} />, label: 'Profile' } // Reusing dashboard for profile in MVP
  ];

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🥗</span>
            <span className={styles.logoText}>FoodTruth <span className={styles.logoBadge}>AI</span></span>
          </Link>
        </div>
        
        {isPublicPage ? (
          <div className={styles.publicNav}>
            <Link to="/login" className={styles.loginBtn}>Login</Link>
            <Link to="/register" className={styles.registerBtn}>Sign Up</Link>
          </div>
        ) : (
          <div className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      {!isPublicPage && (
        <nav className={styles.bottomNav}>
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.path}
              className={`${styles.bottomNavItem} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
