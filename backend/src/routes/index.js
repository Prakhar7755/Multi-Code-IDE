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
router.route("/login").post(login);
router.route("/createProj").post(createProj);
router.route("/saveProject").post(saveProject);
router.route("/getProjects").post(getProjects);
router.route("/getProject").post(getProject);
router.route("/deleteProject").post(deleteProject);
router.route("/editProject").post(editProject);

export default router;
