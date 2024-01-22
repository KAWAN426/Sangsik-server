import mongoose, { ConnectOptions } from "mongoose";

const mongodbConfig = async () => {
  try {
    const ATLAS_URI = process.env.ATLAS_URI;
    if (!ATLAS_URI) return;
    await mongoose.connect(ATLAS_URI, {
      dbName: "sangsiksun",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    return true;
  } catch (err) {
    return false;
  }
};

export default mongodbConfig;
