const mongoose=require('mongoose');

async function main() {

    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log("Connected to MongoDB successfully"); // ✅ Improved log message
    } catch (error) {
        console.error("Database connection failed:", error); // ✅ Added proper error handling
        process.exit(1); // ✅ Exit process if DB connection fails
    }
}

module.exports = main;