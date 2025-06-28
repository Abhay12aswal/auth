import mongoose from "mongoose";

export const connectDB = (uri) => {
  mongoose
    .connect(uri)
    .then((data) => {
      console.log(`mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};