import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ Database connected successfully")
    );
    
    mongoose.connection.on("error", (err) =>
      console.log("❌ Database connection error:", err)
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
    console.log("🔗 Attempting to connect to:", process.env.MONGODB_URI);
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;