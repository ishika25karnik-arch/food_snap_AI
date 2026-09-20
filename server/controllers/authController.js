const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    try {
        const { fullName, email, password, goals, age, gender, height, weight, activityLevel, dietaryPreference } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full name, email, and password are required' });
        }

        // Check if user exists
        const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Transaction for inserting user and profile
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [userResult] = await connection.execute(
                'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
                [fullName, email, passwordHash]
            );
            const userId = userResult.insertId;

            await connection.execute(
                `INSERT INTO user_profiles 
                (user_id, goals, age, gender, height_cm, weight_kg, activity_level, dietary_preference) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId, 
                    goals ? JSON.stringify(goals) : null,
                    age || null,
                    gender || null,
                    height || null,
                    weight || null,
                    activityLevel || null,
                    dietaryPreference || null
                ]
            );

            await connection.commit();

            // Create JWT
            const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: { id: userId, fullName, email }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Logged in successfully',
            token,
            user: { id: user.id, fullName: user.full_name, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.execute(
            `SELECT u.id, u.full_name, u.email, p.goals, p.age, p.gender, p.height_cm, p.weight_kg, p.activity_level, p.dietary_preference 
             FROM users u 
             LEFT JOIN user_profiles p ON u.id = p.user_id 
             WHERE u.id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
    getMe
};
