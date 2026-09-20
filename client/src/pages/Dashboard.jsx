import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Search, Plus } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // In a real app, this would be fetched from API
  const [user, setUser] = useState({ name: 'Alex' });
  
  const recentScans = [
    { id: 1, name: 'Burger', confidence: 78, calories: 650, image: '🍔' },
    { id: 2, name: 'Salad', confidence: 95, calories: 210, image: '🥗' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Good morning, {user.name} 👋
        </motion.h1>
        <p className={styles.subtitle}>Ready to see what's in your food?</p>
      </header>

      <motion.div 
        className={styles.actions}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link to="/scan" className={`${styles.actionCard} ${styles.primaryAction}`}>
            <Camera size={32} />
            <h2>Scan Food</h2>
            <p>Take a photo to analyze composition</p>
          </Link>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/manual" className={styles.actionCard}>
            <Search size={28} />
            <h2>Search Database</h2>
            <p>Look up specific ingredients</p>
          </Link>
        </motion.div>
      </motion.div>

      <motion.section 
        className={styles.recentSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Recent Scans</h2>
          <Link to="/history" className={styles.seeAll}>See All</Link>
        </div>

        <div className={styles.scanGrid}>
          {recentScans.map(scan => (
            <Link to={`/scan/${scan.id}`} key={scan.id} className={styles.scanItem}>
              <div className={styles.scanIcon}>{scan.image}</div>
              <div className={styles.scanInfo}>
                <h3>{scan.name}</h3>
                <p>{scan.calories} kcal • {scan.confidence}% Verified</p>
              </div>
            </Link>
          ))}
          <Link to="/scan" className={styles.newScanBtn}>
            <Plus size={24} />
            <span>New Scan</span>
          </Link>
        </div>
      </motion.section>

      <motion.section 
        className={styles.insightsSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2>Personalized Insights</h2>
        <div className="glass-card">
          <p>Your recent meals have been higher in refined carbohydrates. Consider trying our "What-If" simulator to compare whole wheat alternatives for your next burger.</p>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
