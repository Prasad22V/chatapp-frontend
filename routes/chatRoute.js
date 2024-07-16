import express from "express";
import {
  addmembers,
  deleteChat,
  getChatsDetails,
  getMessages,
  getMyChat,
  getMyGroup,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachments,
} from "../controllers/chatController.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachValidator,
  validateHandler
} from "../lib/validators.js";
import { isAuthenticated } from "../middleware/auth.js";
import { attachmentsMulter } from "../middleware/multer.js";
// import { isAuthenticated } from "../middleware/auth.js";

const app = express.Router();

// aftr here user must be logged in to acces the routes

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChat);
app.get("/my/groups", getMyGroup);
app.put("/addmembers", addMemberValidator(), validateHandler, addmembers);
app.put(
  "/removemembers",
  removeMemberValidator(),
  validateHandler,
  removeMembers
);

app.delete("/leave/:id",  chatIdValidator(), validateHandler, leaveGroup);

// send attachments
app.post(
  "/message",
  attachmentsMulter,
  sendAttachValidator(),
  validateHandler,
  sendAttachments
);

// Get Message
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

//  Get chats Details, rename, delete
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatsDetails)
  .put(renameValidator(), validateHandler, renameGroup)
  .delete(chatIdValidator(), validateHandler,deleteChat);

export default app;
