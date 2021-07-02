import express from "express";
import { PlayerController } from "./controller/playerController";
import { UserController } from "./controller/userController";

const api = express.Router();

const playerController = new PlayerController();

const userController = new UserController();

api.get("/", async (req, res) => {
  res.send("Welcome to the Mongoose & TypeScript example");
});

// Using mount method defining in the controller, mount the parent router
playerController.mount(api);
userController.mount(api)

export default api;
