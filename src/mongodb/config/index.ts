import mongoose, { ConnectOptions } from "mongoose";

const mongodbConfig = async () => {
  const ATLAS_URI = process.env.ATLAS_URI;
  if (!ATLAS_URI) return;
  await mongoose
    .connect(ATLAS_URI, {
      dbName: "10man",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(
      async (dbo) => {
        console.log("mongoDB connected");
        return true;
      },
      (err) => {
        console.log("mongodb connection error", err);
        return;
      }
    );
};

export default mongodbConfig;
