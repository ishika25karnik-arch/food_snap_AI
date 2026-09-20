/**
 * Mock AI Service to simulate the "WOW" features of FoodTruth AI
 * In production, this would integrate with OpenAI Vision API, Google Cloud Vision, or similar.
 */

const analyzeFoodImage = async (imageUrl) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return a mock structured response demonstrating the core product value
    return {
        foodType: "Burger",
        confidence: 85.5,
        components: [
            {
                name: "Bun",
                detected: true,
                confidence: 95.0,
                ingredients: [
                    {
                        name: "Flour type",
                        verificationStatus: "UNKNOWN",
                        possibleCompositions: ["Whole Wheat Flour", "Refined Wheat Flour (Maida)"]
                    }
                ]
            },
            {
                name: "Patty",
                detected: true,
                confidence: 90.0,
                ingredients: [
                    {
                        name: "Beef Patty",
                        verificationStatus: "VISUALLY_DETECTED"
                    }
                ]
            },
            {
                name: "Cheese",
                detected: true,
                confidence: 88.0,
                ingredients: [
                    {
                        name: "Cheddar Cheese",
                        verificationStatus: "VISUALLY_DETECTED"
                    }
                ]
            },
            {
                name: "Vegetables",
                detected: true,
                confidence: 98.0,
                ingredients: [
                    {
                        name: "Lettuce",
                        verificationStatus: "VISUALLY_DETECTED"
                    },
                    {
                        name: "Tomato",
                        verificationStatus: "VISUALLY_DETECTED"
                    }
                ]
            },
            {
                name: "Sauce",
                detected: true,
                confidence: 70.0,
                ingredients: [
                    {
                        name: "Sauce Base",
                        verificationStatus: "UNKNOWN",
                        possibleCompositions: ["Mayonnaise", "Ketchup"]
                    }
                ]
            }
        ]
    };
};

const performOCR = async (textImage) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate OCR finding refined wheat flour
    return {
        extractedText: "Ingredients: Refined wheat flour, Vegetable oil, Sugar, Salt, Yeast",
        structuredIngredients: [
            "Refined Wheat Flour (Maida)"
        ]
    };
};

module.exports = {
    analyzeFoodImage,
    performOCR
};
