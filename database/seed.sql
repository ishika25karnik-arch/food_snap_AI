USE foodtruth;

-- Food Types
INSERT INTO food_types (name, description) VALUES
('Burger', 'A sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.'),
('Pizza', 'A savory dish of Italian origin consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and often various other ingredients.'),
('Salad', 'A dish consisting of mixed, mostly natural ingredients with at least one raw ingredient.');

-- Ingredients
INSERT INTO ingredients (name, is_refined, is_highly_processed, allergens, has_added_sugar) VALUES
('Whole Wheat Flour', FALSE, FALSE, '["Gluten"]', FALSE),
('Refined Wheat Flour (Maida)', TRUE, TRUE, '["Gluten"]', FALSE),
('Beef Patty', FALSE, FALSE, '[]', FALSE),
('Chicken Patty', FALSE, FALSE, '[]', FALSE),
('Cheddar Cheese', FALSE, FALSE, '["Dairy"]', FALSE),
('Lettuce', FALSE, FALSE, '[]', FALSE),
('Tomato', FALSE, FALSE, '[]', FALSE),
('Mayonnaise', FALSE, TRUE, '["Eggs"]', TRUE),
('Ketchup', FALSE, TRUE, '[]', TRUE);

-- Nutrition Data (Per 100g)
-- Approximate values for demonstration
INSERT INTO nutrition_data (ingredient_id, amount, unit, calories, protein, carbohydrates, fat, fiber, sugar, sodium) VALUES
((SELECT id FROM ingredients WHERE name = 'Whole Wheat Flour'), 100, 'g', 339, 13.7, 72.6, 1.9, 12.2, 0.4, 2),
((SELECT id FROM ingredients WHERE name = 'Refined Wheat Flour (Maida)'), 100, 'g', 364, 10.3, 76.3, 1.0, 2.7, 0.3, 2),
((SELECT id FROM ingredients WHERE name = 'Beef Patty'), 100, 'g', 250, 26.0, 0, 15.0, 0, 0, 350),
((SELECT id FROM ingredients WHERE name = 'Chicken Patty'), 100, 'g', 180, 20.0, 5.0, 9.0, 0, 0, 400),
((SELECT id FROM ingredients WHERE name = 'Cheddar Cheese'), 100, 'g', 402, 25.0, 1.3, 33.1, 0, 0.5, 621),
((SELECT id FROM ingredients WHERE name = 'Lettuce'), 100, 'g', 15, 1.4, 2.9, 0.2, 1.3, 0.8, 28),
((SELECT id FROM ingredients WHERE name = 'Tomato'), 100, 'g', 18, 0.9, 3.9, 0.2, 1.2, 2.6, 5),
((SELECT id FROM ingredients WHERE name = 'Mayonnaise'), 100, 'g', 680, 1.0, 0.6, 75.0, 0, 0.6, 635),
((SELECT id FROM ingredients WHERE name = 'Ketchup'), 100, 'g', 112, 1.3, 27.5, 0.3, 0.3, 21.8, 907);
