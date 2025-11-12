const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

dotenv.config();

const seedUsers = async () => {
    try {
        // Use the ENV variable or fallback to localhost
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mental-health-db';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB at ${mongoUri}`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const users = [
            { username: 'student', password: hashedPassword, role: 'student' },
            { username: 'teacher', password: hashedPassword, role: 'teacher' }
        ];

        for (const u of users) {
            const exists = await User.findOne({ username: u.username });
            if (!exists) {
                await User.create(u);
                console.log(`✅ Created test user: ${u.username}`);
            } else {
                console.log(`ℹ️  User already exists: ${u.username}`);
            }
        }

        console.log('Seeding complete. disconnecting...');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedUsers();
