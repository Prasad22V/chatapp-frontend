import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chattu" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      console.error("db Connection Failed");
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  // console.log(process.env.JWT_SECRET);
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  // console.log(token);
  return res.status(code).cookie("chattu-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
  // console.log("Emitting Event", event);
};
// sendToken("vgv", {_id:"gbgrtht"}, 201, "User Created")

const uploadFilesToCloudinary = async (files = []) => {
  // console.log('Files to upload:', files);
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      // const base64File = ;
      cloudinary.uploader.upload(
        // base64File,
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          // console.log(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    // console.log("Error uploading files to Cloudinary:", error);
    throw new Error("Error uploading files to cloudinary", err);
  }
};

const deleteFilesFromCloudinary = async (public_id) => {};
export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
