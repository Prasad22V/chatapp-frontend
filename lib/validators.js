import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utills/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(",");

  // console.log(errorMessages);
  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
  body("name", "please enter the name").notEmpty(),
  body("username", "please enter the username").notEmpty(),
  body("bio", "please enter the Bio").notEmpty(),
  body("password", "please enter the Password").notEmpty(),
  // check("avatar","Please upload Avtar").notEmpty() 
];

const loginValidator = () => [
  body("username", "please enter the Username").notEmpty(),

  body("password", "please enter the Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "please enter the Name").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please Enter members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
];

const addMemberValidator = () => [
  body("chatId", "please enter the chat Id").notEmpty(),

  body("members")
    .notEmpty()
    .withMessage("Please Enter members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

const removeMemberValidator = () => [
  body("chatId", "please enter the chat Id").notEmpty(),

  body("userId").notEmpty().withMessage("Please Enter userId"),
];

const sendAttachValidator = () => [
  body("chatId", "please enter the chat Id").notEmpty(),

];

const chatIdValidator = () => [
  param("id", "please enter the chat Id").notEmpty(),
];

const renameValidator = () => [
  param("id", "please enter the chat Id").notEmpty(),
  param("name", "please enter the New Name").notEmpty(),
];

const sendFrndRequsValidator = () => [
  body("userId", "please enter the User Id").notEmpty(),
];

const acceptRequstValidator = () => [
  body("requestId", "please enter the Request Id").notEmpty(),
  body("accept")
    .notEmpty().withMessage( "please add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

const adminLoginValidator = () => [
  body("secretkey", "please enter the Secret key").notEmpty(),

];

export {
  acceptRequstValidator, addMemberValidator, adminLoginValidator, chatIdValidator,
  loginValidator,
  newGroupValidator,
  registerValidator,
  removeMemberValidator, renameValidator, sendAttachValidator, sendFrndRequsValidator, validateHandler
};

