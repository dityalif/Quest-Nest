const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./src/routes/users.route');

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello from QuestNest!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});