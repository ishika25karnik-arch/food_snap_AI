const db = require('../config/db');
const aiService = require('../services/aiService');
const nutritionService = require('../services/nutritionService');

// In a real app, this would handle file upload to S3/Cloudinary
const createScan = async (req, res) => {
    try {
        const userId = req.user.id;
        // Mock image URL for now
        const imageUrl = 'https://example.com/burger.jpg'; 

        const [scanResult] = await db.execute(
            'INSERT INTO food_scans (user_id, image_url, status) VALUES (?, ?, ?)',
            [userId, imageUrl, 'PENDING']
        );
        
        res.status(201).json({
            message: 'Scan created',
            scanId: scanResult.insertId
        });
    } catch (error) {
        console.error('Create scan error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const analyzeScan = async (req, res) => {
    const scanId = req.params.id;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Analyze Image using Mock AI
        const aiResult = await aiService.analyzeFoodImage('dummy-url');
        
        // Find or create food type
        let foodTypeId;
        const [existingTypes] = await connection.execute('SELECT id FROM food_types WHERE name = ?', [aiResult.foodType]);
        if (existingTypes.length > 0) {
            foodTypeId = existingTypes[0].id;
        } else {
            const [typeResult] = await connection.execute('INSERT INTO food_types (name) VALUES (?)', [aiResult.foodType]);
            foodTypeId = typeResult.insertId;
        }

        // Update scan record
        await connection.execute(
            'UPDATE food_scans SET detected_food_type_id = ?, overall_confidence = ?, status = ? WHERE id = ?',
            [foodTypeId, aiResult.confidence, 'ANALYZED', scanId]
        );

        // Insert components and ingredients
        for (const comp of aiResult.components) {
            const [compResult] = await connection.execute(
                'INSERT INTO food_components (scan_id, name, detected, confidence) VALUES (?, ?, ?, ?)',
                [scanId, comp.name, comp.detected, comp.confidence]
            );
            const componentId = compResult.insertId;

            for (const ing of comp.ingredients) {
                // Try to map to database ingredient
                let ingredientId = null;
                const [dbIngredients] = await connection.execute('SELECT id FROM ingredients WHERE name = ?', [ing.name]);
                if (dbIngredients.length > 0) {
                    ingredientId = dbIngredients[0].id;
                }

                // Insert food ingredient mapping
                await connection.execute(
                    'INSERT INTO food_ingredients (component_id, ingredient_id, verification_status) VALUES (?, ?, ?)',
                    [componentId, ingredientId, ing.verificationStatus]
                );
            }
        }

        await connection.commit();

        // 2. Calculate initial nutrition
        const nutrition = await nutritionService.calculateNutrition(scanId);
        
        // Save nutrition estimate
        await db.execute(
            `INSERT INTO nutrition_estimates 
            (scan_id, total_calories, total_protein, total_carbs, total_fat, total_fiber, total_sugar, total_sodium, is_exact, verification_score) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [scanId, nutrition.totalCalories, nutrition.totalProtein, nutrition.totalCarbs, nutrition.totalFat, nutrition.totalFiber, nutrition.totalSugar, nutrition.totalSodium, nutrition.isExact, nutrition.verificationScore]
        );

        res.json({
            message: 'Scan analyzed successfully',
            nutrition
        });
    } catch (error) {
        await connection.rollback();
        console.error('Analyze scan error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        connection.release();
    }
};

const getScanDetails = async (req, res) => {
    try {
        const scanId = req.params.id;
        
        const [scans] = await db.execute(`
            SELECT s.*, f.name as food_name 
            FROM food_scans s 
            LEFT JOIN food_types f ON s.detected_food_type_id = f.id 
            WHERE s.id = ?
        `, [scanId]);

        if (scans.length === 0) {
            return res.status(404).json({ message: 'Scan not found' });
        }

        const scan = scans[0];

        // Get components
        const [components] = await db.execute('SELECT * FROM food_components WHERE scan_id = ?', [scanId]);
        
        // Get ingredients for components
        for (let comp of components) {
            const [ingredients] = await db.execute(`
                SELECT fi.*, i.name as ingredient_name, i.is_refined, i.has_added_sugar
                FROM food_ingredients fi 
                LEFT JOIN ingredients i ON fi.ingredient_id = i.id 
                WHERE fi.component_id = ?
            `, [comp.id]);
            comp.ingredients = ingredients;
        }

        // Get nutrition
        const [nutrition] = await db.execute('SELECT * FROM nutrition_estimates WHERE scan_id = ?', [scanId]);

        res.json({
            scan,
            components,
            nutrition: nutrition.length > 0 ? nutrition[0] : null
        });

    } catch (error) {
        console.error('Get scan details error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createScan,
    analyzeScan,
    getScanDetails
};
