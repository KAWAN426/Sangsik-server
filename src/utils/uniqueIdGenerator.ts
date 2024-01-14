import { Model } from "mongoose";

function generateUniqueId(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function generateUniqueUserId(Model: Model<any, any>, length = 10) {
  while (true) {
    const uniqueId = generateUniqueId(length);
    const existingUser = await Model.findOne({ uniqueId });
    if (!existingUser) return uniqueId;
  }
}
