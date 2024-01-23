import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async () => {
  try {
    const ATLAS_URI = process.env.ATLAS_URI;
    if (!ATLAS_URI) return console.log("Cannot found ATLAS_URI");
    const conn = await mongoose.connect(ATLAS_URI, {
      dbName: "sangsiksun",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
