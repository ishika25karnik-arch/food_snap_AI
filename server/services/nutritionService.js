const db = require('../config/db');

/**
 * Deterministic Nutrition Calculator
 * Nutrition = Σ (ingredient quantity × nutrition per unit)
 */
const calculateNutrition = async (scanId) => {
    // 1. Get all components for this scan
    const [components] = await db.execute('SELECT id FROM food_components WHERE scan_id = ?', [scanId]);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;
    let allVerified = true;
    let verificationScoreTotal = 0;
    let totalItems = 0;

    for (let component of components) {
        // Get ingredients for this component
        const [ingredients] = await db.execute(`
            SELECT fi.quantity, fi.unit, fi.verification_status, n.calories, n.protein, n.carbohydrates, n.fat, n.fiber, n.sugar, n.sodium, n.amount as base_amount
            FROM food_ingredients fi
            JOIN nutrition_data n ON fi.ingredient_id = n.ingredient_id
            WHERE fi.component_id = ?
        `, [component.id]);

        for (let item of ingredients) {
            totalItems++;
            
            // Assume 100g if quantity is missing for the MVP
            const quantity = item.quantity || 100;
            const multiplier = quantity / item.base_amount;

            totalCalories += parseFloat(item.calories) * multiplier;
            totalProtein += parseFloat(item.protein) * multiplier;
            totalCarbs += parseFloat(item.carbohydrates) * multiplier;
            totalFat += parseFloat(item.fat) * multiplier;
            totalFiber += parseFloat(item.fiber) * multiplier;
            totalSugar += parseFloat(item.sugar) * multiplier;
            totalSodium += parseFloat(item.sodium) * multiplier;

            if (item.verification_status === 'VERIFIED') {
                verificationScoreTotal += 100;
            } else if (item.verification_status === 'VISUALLY_DETECTED') {
                verificationScoreTotal += 70;
                allVerified = false;
            } else if (item.verification_status === 'ESTIMATED') {
                verificationScoreTotal += 50;
                allVerified = false;
            } else {
                allVerified = false;
            }
        }
    }

    const verificationScore = totalItems > 0 ? (verificationScoreTotal / totalItems) : 0;

    return {
        totalCalories: totalCalories.toFixed(2),
        totalProtein: totalProtein.toFixed(2),
        totalCarbs: totalCarbs.toFixed(2),
        totalFat: totalFat.toFixed(2),
        totalFiber: totalFiber.toFixed(2),
        totalSugar: totalSugar.toFixed(2),
        totalSodium: totalSodium.toFixed(2),
        isExact: allVerified,
        verificationScore: verificationScore.toFixed(2)
    };
};

module.exports = {
    calculateNutrition
};
