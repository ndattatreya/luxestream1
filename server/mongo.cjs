const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { celebrate, Joi, errors } = require('celebrate');
const app = express();
const port = 3000;
const mongoAtlasUri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8";
mongoose.connect(mongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('MongoDB Atlas connection error:', err);
});
app.use(express.json());
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ },
    password: { type: String, required: true, minlength: 8 },
    subscription: {
        type: String,
        enum: ['free', 'premium'], 
        default: 'free',
    },
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    lastWatched: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    progress: {
        type: Map,
        of: Number
    }
});
const User = mongoose.model('User', userSchema);
app.post('/users/register', celebrate({
    body: Joi.object({
        username: Joi.string().required().trim().min(3).max(30),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
    }),
}), async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post('/users/login', celebrate({
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
}), async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const { password: omit, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.get('/users/:id', celebrate({
    params: Joi.object({
        id: Joi.string().required().length(24),
    }),
}), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password: omit, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post('/users/:userId/watchlist/:movieId', celebrate({
    params: Joi.object({
        userId: Joi.string().required().length(24),
        movieId: Joi.string().required().length(24),
    }),
}), async (req, res) => {
    const { userId, movieId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.watchList.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in watchlist' });
        }
        user.watchList.push(movieId);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.get('/users/:userId/watchlist', celebrate({
    params: Joi.object({
        userId: Joi.string().required().length(24),
    }),
}), async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('watchList');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.watchList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/users/:userId/progress/:movieId', celebrate({
    params: Joi.object({
        userId: Joi.string().required().length(24),
        movieId: Joi.string().required().length(24),
    }),
    body: Joi.object({
        progress: Joi.number().required(),
    })
}), async (req, res) => {
    const { userId, movieId } = req.params;
    const { progress } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.lastWatched = movieId;
        user.progress.set(movieId, progress);
        await user.save();
        res.status(200).json({ message: 'Progress updated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Error handling middleware
app.use(errors());
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});