import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import styles from './History.module.css';

const History = () => {
  const [filter, setFilter] = useState('ALL');

  const historyData = [
    { id: 1, date: '2026-09-18', name: 'Burger', calories: 650, verified: 72 },
    { id: 2, date: '2026-09-17', name: 'Caesar Salad', calories: 320, verified: 90 },
    { id: 3, date: '2026-09-16', name: 'Pizza Slice', calories: 280, verified: 65 },
    { id: 4, date: '2026-09-15', name: 'Grilled Chicken', calories: 410, verified: 95 },
    { id: 5, date: '2026-09-14', name: 'Pasta', calories: 550, verified: 50 },
  ];

  // For charts
  const nutritionTrend = historyData.map(item => ({
    date: item.date.slice(5), // Just MM-DD
    calories: item.calories,
    verified: item.verified
  })).reverse();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Your Food History</h1>
        <p>Review your past scans and nutrition trends.</p>
      </header>

      <div className={styles.dashboardGrid}>
        
        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <div className="glass-card">
            <h2>Calorie Trend</h2>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={nutritionTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <h2>Verification Confidence Over Time</h2>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={nutritionTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="verified" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2>Recent Entries</h2>
            <div className={styles.filters}>
              <button 
                className={`${styles.filterBtn} ${filter === 'ALL' ? styles.active : ''}`}
                onClick={() => setFilter('ALL')}
              >All</button>
              <button 
                className={`${styles.filterBtn} ${filter === 'HIGH_VERIFIED' ? styles.active : ''}`}
                onClick={() => setFilter('HIGH_VERIFIED')}
              >Highly Verified</button>
            </div>
          </div>

          <div className={styles.historyList}>
            <AnimatePresence>
              {historyData
                .filter(item => filter === 'ALL' || (filter === 'HIGH_VERIFIED' && item.verified >= 80))
                .map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={styles.historyCard}
                >
                  <div className={styles.cardMain}>
                    <h3>{item.name}</h3>
                    <span className={styles.date}>{item.date}</span>
                  </div>
                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span className={styles.statVal}>{item.calories}</span>
                      <span className={styles.statLbl}>kcal</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statVal} style={{color: item.verified > 75 ? 'var(--success)' : 'var(--warning)'}}>
                        {item.verified}%
                      </span>
                      <span className={styles.statLbl}>verified</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default History;
