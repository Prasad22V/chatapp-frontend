import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFrndRequest,
} from "../controllers/userController.js";
import {
  acceptRequstValidator,
  loginValidator,
  registerValidator,
  sendFrndRequsValidator,
  validateHandler,
} from "../lib/validators.js";
import { isAuthenticated } from "../middleware/auth.js";
import { singleAvatar } from "../middleware/multer.js";
// import { isAuthenticated } from "../middleware/auth.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// aftr here user must be logged in to acces the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);
app.get("/search", searchUser);

app.put(
  "/sendrequest",
  sendFrndRequsValidator(),
  validateHandler,
  sendFrndRequest
);
app.put(
  "/acceptrequest",
  acceptRequstValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get("/notifications", getMyNotifications);
app.get("/friends", getMyFriends);

export default app;
