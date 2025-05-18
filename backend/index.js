const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./src/routes/users.route');
const teamRoutes = require('./src/routes/teams.route');
const challengeRoutes = require('./src/routes/challenges.route');
const leaderboardRoutes = require('./src/routes/leaderboard.route');
const badgeRoutes = require('./src/routes/badges.route');

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/challenges', challengeRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/badges', badgeRoutes);

app.get('/', (req, res) => {
    res.send('Hello from QuestNest!');
});

// Add this endpoint for testing
app.get('/test', (req, res) => {
    res.send('API is working!');
});

// Also add a database check if possible
app.get('/db-test', async (req, res) => {
    try {
        const db = require('./src/database/pg.database');
        const result = await db.query('SELECT NOW()');
        res.json({ success: true, message: 'Database connected', timestamp: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});