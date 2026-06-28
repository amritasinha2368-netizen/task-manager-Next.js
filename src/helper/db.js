import mongoose from "mongoose";

const config = {
  isConnected: 0,
};

export const connectDb = async () => {
  if (config.isConnected) {
    return;
  }

  try {
    if (!process.env.MONGO_DB_URL) {
      throw new Error("MONGO_DB_URL is missing in .env");
    }

    const { connection } = await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "work_manager",
    });

    config.isConnected = connection.readyState;
    console.log("connected with host", connection.host);
  } catch (error) {
    console.log("failed  to connect with database");
    console.log(error);
    throw error;
  }
};
