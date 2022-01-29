import mongoose from "mongoose";
export default mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/rest-cats", {
  autoIndex: true,
});
