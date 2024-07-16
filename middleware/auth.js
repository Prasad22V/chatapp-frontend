import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utills/utility.js";
import { adminSecretkey } from "../app.js";
import { TryCatch } from "./error.js";
import { CHATTU_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

const isAuthenticated = TryCatch((req, res, next) => {
  // console.log("cookie:", req.cookies);
  const token = req.cookies[CHATTU_TOKEN];
  // console.count("isAuthenticate");

  if (!token)
    return next(new ErrorHandler("please login to acces the route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData._id;

  next();
});

const adminOnly = (req, res, next) => {
  // console.log("cookie:", req.cookies);
  const token = req.cookies["chattu-admin-token"];

  if (!token)
    return next(new ErrorHandler("Only Admin can  acces the route", 401));

  const secretkey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretkey === adminSecretkey;
  if (!isMatched)
    return next(new ErrorHandler("Only Admin can  acces the route", 401));

  next(); 
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CHATTU_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access the route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);
    if (!user)
      return next(new ErrorHandler("Please login to access the route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access the route", 401));
  }
};

export { isAuthenticated, adminOnly, socketAuthenticator };
