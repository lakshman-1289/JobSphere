const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        const msg = `MongoDB Connected: ${conn.connection.host}`;
        console.log(msg);
        try { require('fs').appendFileSync('server_log.txt', msg + '\n'); } catch (e) { }
    } catch (error) {
        const msg = `Error: ${error.message}`;
        console.error(msg);
        try { require('fs').appendFileSync('server_log.txt', msg + '\n'); } catch (e) { }
        process.exit(1);
    }
};

module.exports = connectDB;
