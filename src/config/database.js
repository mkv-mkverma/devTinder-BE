// https://cloud.mongodb.com/v2/6abe71ac5a17dbebbf47046e#/clusters
import mongoose from "mongoose";

const connectDB = async (username, password) => {
  const URL = `mongodb+srv://${username}:${password}@namastenode.asztx3j.mongodb.net/devTinder-BE`;
  await mongoose.connect(URL);
};

export default connectDB;
