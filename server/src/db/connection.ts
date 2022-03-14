import mongoose from "mongoose";
export default mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/app-lang", {
    autoIndex: true,
  })
  .catch((e) => console.log("error on connection", e));
