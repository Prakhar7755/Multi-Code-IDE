import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://localhost:27017/codeIDE2";

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);

    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      connectDB();
    }, 5000);

    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
