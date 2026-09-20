import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronRight, CheckCircle2, AlertCircle, HelpCircle, ArrowRightLeft } from 'lucide-react';
import styles from './Scanner.module.css';

const Scanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisState, setAnalysisState] = useState('IDLE'); // IDLE, ANALYZING, COMPLETED
  const [analysisStep, setAnalysisStep] = useState(0);
  const [report, setReport] = useState(null);
  
  // For the simulator
  const [activeSimulatorComponent, setActiveSimulatorComponent] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      setAnalysisState('IDLE');
      setReport(null);
    }
  };

  const handleAnalyze = () => {
    setAnalysisState('ANALYZING');
    setAnalysisStep(1);

    // Simulate multi-stage AI analysis
    setTimeout(() => setAnalysisStep(2), 1500); // Identifying components
    setTimeout(() => setAnalysisStep(3), 3000); // Reconstructing composition
    setTimeout(() => setAnalysisStep(4), 4500); // Checking evidence
    setTimeout(() => {
      setAnalysisStep(5);
      // Mock Report Data
      setReport({
        foodName: "Burger",
        confidence: 78,
        verificationScore: 72,
        components: [
          {
            name: "Bun",
            detected: true,
            ingredients: [
              { name: "Flour type", status: "UNKNOWN", options: ["Whole Wheat", "Refined Flour / Maida", "Multigrain"], selected: "UNKNOWN" }
            ]
          },
          {
            name: "Patty",
            detected: true,
            ingredients: [
              { name: "Beef Patty", status: "VERIFIED" }
            ]
          },
          {
            name: "Cheese",
            detected: true,
            ingredients: [
              { name: "Cheddar Cheese", status: "DETECTED" }
            ]
          },
          {
            name: "Sauce",
            detected: true,
            ingredients: [
              { name: "Unknown Sauce", status: "UNKNOWN", options: ["Mayonnaise", "Ketchup"], selected: "UNKNOWN" }
            ]
          }
        ],
        nutrition: {
          calories: "650",
          protein: "32",
          carbs: "45",
          fat: "35",
          fiber: "3",
          isExact: false
        }
      });
      setAnalysisState('COMPLETED');
    }, 6000);
  };

  const simulateWhatIf = (componentIdx, ingredientIdx, newOption) => {
    const updatedReport = { ...report };
    updatedReport.components[componentIdx].ingredients[ingredientIdx].selected = newOption;
    
    // Recalculate mock nutrition based on selection
    if (newOption === "Whole Wheat") {
      updatedReport.nutrition.fiber = "8";
      updatedReport.nutrition.calories = "620";
    } else if (newOption === "Refined Flour / Maida") {
      updatedReport.nutrition.fiber = "2";
      updatedReport.nutrition.calories = "660";
    }
    
    setReport(updatedReport);
    setActiveSimulatorComponent(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'VERIFIED': return <CheckCircle2 className="status-verified" size={18} />;
      case 'DETECTED': return <CheckCircle2 className="status-detected" size={18} />;
      case 'ESTIMATED': return <AlertCircle className="status-estimated" size={18} />;
      default: return <HelpCircle className="status-unknown" size={18} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        
        {/* Left Column: Image Upload & Preview */}
        <div className={styles.uploadSection}>
          <h2>Scan Food</h2>
          {!preview ? (
            <div 
              className={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className={styles.uploadIcon} />
              <h3>Upload or Take a Photo</h3>
              <p>Drag & drop a food image here, or click to select</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                hidden 
              />
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <img src={preview} alt="Food Preview" className={styles.previewImage} />
              {analysisState === 'IDLE' && (
                <button className={styles.analyzeBtn} onClick={handleAnalyze}>
                  Analyze Food
                </button>
              )}
            </div>
          )}

          {/* Analysis Progress */}
          {analysisState === 'ANALYZING' && (
            <div className={styles.analysisProgress}>
              <h3>Analyzing...</h3>
              <ul className={styles.stepList}>
                <motion.li initial={{opacity:0}} animate={{opacity: analysisStep >= 1 ? 1 : 0.3}}>1. Detecting food</motion.li>
                <motion.li initial={{opacity:0}} animate={{opacity: analysisStep >= 2 ? 1 : 0.3}}>2. Identifying components</motion.li>
                <motion.li initial={{opacity:0}} animate={{opacity: analysisStep >= 3 ? 1 : 0.3}}>3. Reconstructing composition</motion.li>
                <motion.li initial={{opacity:0}} animate={{opacity: analysisStep >= 4 ? 1 : 0.3}}>4. Checking evidence</motion.li>
                <motion.li initial={{opacity:0}} animate={{opacity: analysisStep >= 5 ? 1 : 0.3}}>5. Calculating nutrition</motion.li>
              </ul>
              <div className={styles.spinner}></div>
            </div>
          )}
        </div>

        {/* Right Column: Results & "What-If" Simulator */}
        <div className={styles.resultsSection}>
          <AnimatePresence mode="wait">
            {analysisState === 'COMPLETED' && report && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.reportContainer}
              >
                <header className={styles.reportHeader}>
                  <div>
                    <h1>{report.foodName}</h1>
                    <p>{report.verificationScore}% Information Verified</p>
                  </div>
                  <div className={styles.nutritionSummary}>
                    <div className={styles.nutriBox}>
                      <span className={styles.val}>{report.nutrition.calories}</span>
                      <span className={styles.lbl}>kcal</span>
                    </div>
                  </div>
                </header>

                <div className={styles.compositionMap}>
                  <h2>Food Composition Map</h2>
                  <div className={styles.componentList}>
                    {report.components.map((comp, cIdx) => (
                      <div key={cIdx} className={styles.componentCard}>
                        <div className={styles.compHeader}>
                          <h3>{comp.name}</h3>
                          <span className={styles.detectedBadge}>Visible: ✓</span>
                        </div>
                        
                        <div className={styles.ingredientList}>
                          {comp.ingredients.map((ing, iIdx) => (
                            <div key={iIdx} className={styles.ingredientRow}>
                              <div className={styles.ingInfo}>
                                {getStatusIcon(ing.status)}
                                <span>{ing.name}</span>
                                {ing.selected !== "UNKNOWN" && <span className={styles.selectedSim}>({ing.selected})</span>}
                              </div>
                              
                              {ing.status === 'UNKNOWN' && (
                                <button 
                                  className={styles.simBtn}
                                  onClick={() => setActiveSimulatorComponent({ cIdx, iIdx, ing })}
                                >
                                  <ArrowRightLeft size={14} /> Compare Versions
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition Panel */}
                <div className={styles.nutritionPanel}>
                  <h2>Estimated Nutrition {report.nutrition.isExact ? '' : '(Contains Assumptions)'}</h2>
                  <div className={styles.macroGrid}>
                    <div className={styles.macroItem}>
                      <span className={styles.macroLbl}>Protein</span>
                      <span className={styles.macroVal}>{report.nutrition.protein}g</span>
                    </div>
                    <div className={styles.macroItem}>
                      <span className={styles.macroLbl}>Carbs</span>
                      <span className={styles.macroVal}>{report.nutrition.carbs}g</span>
                    </div>
                    <div className={styles.macroItem}>
                      <span className={styles.macroLbl}>Fat</span>
                      <span className={styles.macroVal}>{report.nutrition.fat}g</span>
                    </div>
                    <div className={styles.macroItem}>
                      <span className={styles.macroLbl}>Fiber</span>
                      <span className={styles.macroVal}>{report.nutrition.fiber}g</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simulator Modal */}
      <AnimatePresence>
        {activeSimulatorComponent && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent}>
              <h2>"What-If" Simulator</h2>
              <p>We can see the {report.components[activeSimulatorComponent.cIdx].name}, but we can't visually verify the exact composition.</p>
              
              <div className={styles.optionsList}>
                {activeSimulatorComponent.ing.options.map((opt, idx) => (
                  <div 
                    key={idx} 
                    className={styles.optionCard}
                    onClick={() => simulateWhatIf(activeSimulatorComponent.cIdx, activeSimulatorComponent.iIdx, opt)}
                  >
                    <h3>{opt}</h3>
                    <p>Click to simulate nutrition</p>
                  </div>
                ))}
              </div>
              
              <button className={styles.closeBtn} onClick={() => setActiveSimulatorComponent(null)}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Scanner;
