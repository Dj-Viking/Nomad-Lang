import mongoose from "mongoose";
export default mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/rest-cats", {
    autoIndex: true,
  })
  .catch((e) => console.log("error on connection", e));
