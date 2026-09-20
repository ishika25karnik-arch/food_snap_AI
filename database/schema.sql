CREATE DATABASE IF NOT EXISTS foodtruth;
USE foodtruth;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goals JSON, -- Array of strings e.g. ["Weight management", "High protein"]
    age INT,
    gender VARCHAR(50),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    activity_level VARCHAR(50),
    dietary_preference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_refined BOOLEAN DEFAULT FALSE,
    is_highly_processed BOOLEAN DEFAULT FALSE,
    allergens JSON, -- Array of allergens e.g., ["Gluten", "Dairy"]
    has_added_sugar BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nutrition_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 100, -- Base amount, e.g., 100
    unit VARCHAR(20) NOT NULL DEFAULT 'g', -- Base unit, e.g., 'g' or 'ml'
    calories DECIMAL(10,2) NOT NULL DEFAULT 0,
    protein DECIMAL(10,2) NOT NULL DEFAULT 0,
    carbohydrates DECIMAL(10,2) NOT NULL DEFAULT 0,
    fat DECIMAL(10,2) NOT NULL DEFAULT 0,
    fiber DECIMAL(10,2) NOT NULL DEFAULT 0,
    sugar DECIMAL(10,2) NOT NULL DEFAULT 0,
    sodium DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS evidence_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_type ENUM('IMAGE_DETECTION', 'OCR_LABEL', 'USER_INPUT', 'RECIPE', 'RESTAURANT_MENU', 'SYSTEM_ESTIMATE') NOT NULL,
    source_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_scans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_url VARCHAR(255),
    detected_food_type_id INT,
    overall_confidence DECIMAL(5,2),
    status ENUM('PENDING', 'ANALYZED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (detected_food_type_id) REFERENCES food_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS food_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g., "Bun", "Patty"
    detected BOOLEAN DEFAULT TRUE,
    confidence DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES food_scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    component_id INT NOT NULL,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    unit VARCHAR(20),
    verification_status ENUM('VERIFIED', 'VISUALLY_DETECTED', 'ESTIMATED', 'UNKNOWN') DEFAULT 'UNKNOWN',
    evidence_source_id INT,
    FOREIGN KEY (component_id) REFERENCES food_components(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE SET NULL,
    FOREIGN KEY (evidence_source_id) REFERENCES evidence_sources(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS nutrition_estimates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    total_calories DECIMAL(10,2) DEFAULT 0,
    total_protein DECIMAL(10,2) DEFAULT 0,
    total_carbs DECIMAL(10,2) DEFAULT 0,
    total_fat DECIMAL(10,2) DEFAULT 0,
    total_fiber DECIMAL(10,2) DEFAULT 0,
    total_sugar DECIMAL(10,2) DEFAULT 0,
    total_sodium DECIMAL(10,2) DEFAULT 0,
    is_exact BOOLEAN DEFAULT FALSE,
    verification_score DECIMAL(5,2) DEFAULT 0, -- e.g. 72.50 for 72.5%
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES food_scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scan_evidence (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    evidence_source_id INT NOT NULL,
    raw_data TEXT, -- e.g. OCR text
    processed_data JSON, -- e.g. Extracted structured ingredients
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES food_scans(id) ON DELETE CASCADE,
    FOREIGN KEY (evidence_source_id) REFERENCES evidence_sources(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS saved_foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scan_id INT, -- Can be null if it's a manually created food
    custom_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scan_id) REFERENCES food_scans(id) ON DELETE SET NULL
);

-- For What-If Simulator Scenarios
CREATE TABLE IF NOT EXISTS food_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id INT NOT NULL,
    scenario_name VARCHAR(255) NOT NULL, -- e.g. "Whole Wheat Bun Version"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES food_scans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scenario_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scenario_id INT NOT NULL,
    component_id INT NOT NULL, -- Which component this overrides
    ingredient_id INT NOT NULL, -- The new assumed ingredient
    FOREIGN KEY (scenario_id) REFERENCES food_scenarios(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES food_components(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);
