import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import styles from './LandingPage.module.css';

// 3D Burger Component
const BurgerModel = ({ expanded }) => {
  const spacing = expanded ? 1.5 : 0.3;

  return (
    <group position={[0, -1, 0]}>
      {/* Top Bun */}
      <mesh position={[0, spacing * 2, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.6, 32]} />
        <meshStandardMaterial color="#E2A76F" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Top Bun</Text>}
      </mesh>

      {/* Lettuce */}
      <mesh position={[0, spacing * 1, 0]}>
        <cylinderGeometry args={[1.6, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#4CAF50" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Lettuce</Text>}
      </mesh>

      {/* Tomato */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial color="#F44336" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Tomato</Text>}
      </mesh>

      {/* Cheese */}
      <mesh position={[0, -spacing * 1, 0]}>
        <boxGeometry args={[2.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#FFC107" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Cheese</Text>}
      </mesh>

      {/* Patty */}
      <mesh position={[0, -spacing * 2, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.5, 32]} />
        <meshStandardMaterial color="#5D4037" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Beef Patty</Text>}
      </mesh>

      {/* Bottom Bun */}
      <mesh position={[0, -spacing * 3, 0]}>
        <cylinderGeometry args={[1.6, 1.5, 0.5, 32]} />
        <meshStandardMaterial color="#E2A76F" />
        {expanded && <Text position={[2, 0, 0]} fontSize={0.3} color="white">Bottom Bun</Text>}
      </mesh>
    </group>
  );
};

const LandingPage = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.title}
          >
            See your food. <br/>
            <span className={styles.highlight}>Understand what's inside.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.subtitle}
          >
            FoodTruth AI analyzes food images, reconstructs visible and hidden components, verifies available evidence, and calculates nutrition from the resulting food composition.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.ctaGroup}
          >
            <Link to="/scan" className={styles.primaryCta}>Scan Your Food</Link>
            <button 
              className={styles.secondaryCta}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Collapse Components" : "Explore How It Works"}
            </button>
          </motion.div>
        </div>

        {/* 3D Visual */}
        <div className={styles.canvasContainer}>
          <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <BurgerModel expanded={expanded} />
            <OrbitControls enableZoom={false} autoRotate={!expanded} autoRotateSpeed={2} />
          </Canvas>
        </div>
      </section>

      {/* Why Section */}
      <section className={styles.whySection}>
        <h2 className={styles.sectionTitle}>A photo can show food. It can't show everything inside it.</h2>
        
        <div className={styles.featureGrid}>
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card"
          >
            <div className={styles.iconBox}>👁</div>
            <h3>SEE</h3>
            <p>Our computer vision identifies the food type and visually apparent components.</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card"
          >
            <div className={styles.iconBox}>🔎</div>
            <h3>VERIFY</h3>
            <p>We separate what we can confirm via OCR or user input from what we must assume.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card"
          >
            <div className={styles.iconBox}>🧠</div>
            <h3>CALCULATE</h3>
            <p>Nutrition is deterministically calculated from the verified and estimated composition.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
