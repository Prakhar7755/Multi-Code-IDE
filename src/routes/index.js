import express from "express";
import {
  signup,
  login,
  createProj,
  saveProject,
  getProjects,
  getProject,
  deleteProject,
  editProject,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World from the router!");
});

router.route("/signup").post(signup);
router.post("/login", login);
router.post("/createProj", createProj);
router.post("/saveProject", saveProject);
router.post("/getProjects", getProjects);
router.post("/getProject", getProject);
router.post("/deleteProject", deleteProject);
router.post("/editProject", editProject);

export default router;
