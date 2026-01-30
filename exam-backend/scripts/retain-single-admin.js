require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { User } = require('../models/models');

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        const admins = await User.find({ role: { $regex: '^admin$', $options: 'i' } }).sort({ _id: 1 });
        console.log(`Found ${admins.length} admin(s) in database.`);
        
        if (admins.length <= 1) {
            console.log('✓ No action needed: single or no Admin present.');
            await mongoose.disconnect();
            process.exit(0);
        }

        const keeper = admins[0];
        console.log(`Keeping admin: ${keeper.username} (${keeper._id.toString()})`);

        const toDemote = admins.slice(1);
        for (const u of toDemote) {
            // Demote extras to 'Teacher' to preserve access for management
            await User.findByIdAndUpdate(u._id, { role: 'Teacher' });
            console.log(`✓ Demoted: ${u.username} (${u._id.toString()})`);
        }

        console.log(`\n✓ Successfully demoted ${toDemote.length} admin(s) to 'Teacher'.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error during admin cleanup:', err);
        process.exit(1);
    }
}

run();
