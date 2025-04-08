import userModel from "../models/userModel.js";
import projectModel from "../models/projectModel.js";
import bcrypt from "bcryptjs";

const secret = process.env.JWT_SECRET;

function getCodeTemplate(language) {
  if (language.toLowerCase() === "python") {
    return 'print("Hello World")';
  } else if (language.toLowerCase() === "java") {
    return 'public class Main { public static void main(String[] args) { System.out.println("Hello World"); } }';
  } else if (language.toLowerCase() === "javascript") {
    return 'console.log("Hello World");';
  } else if (language.toLowerCase() === "cpp") {
    return '#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}';
  } else if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}';
  } else if (language.toLowerCase() === "go") {
    return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}';
  } else if (language.toLowerCase() === "bash") {
    return 'echo "Hello World"';
  } else {
    return "Language not supported";
  }
}

const signup = async (req, res) => {
  try {
    let { email, pwd, fullName } = req.body;

    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.status(400).json({
        success: false,
        msg: "Email already exist",
      });
    }

    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(pwd, salt, async function (err, hash) {
        let user = await userModel.create({
          email: email,
          password: hash,
          fullName: fullName,
        });

        return res.status(200).json({
          success: true,
          msg: "User created successfully",
          email: user.email,
        });
      });
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, pwd } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    bcrypt.compare(pwd, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ userId: user._id }, secret);

        return res.status(200).json({
          success: true,
          msg: "User logged in successfully",
          token,
        });
      } else {
        return res.status(401).json({
          success: false,
          msg: "Invalid password",
        });
      }
    });
  } catch (error) {
    console.error("Error in login:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const createProj = async (req, res) => {
  try {
    const { name, projLanguage, token, version } = req.body;
    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while project creation",
      });
    }
    const project = await projectModel.create({
      name,
      projLanguage,
      code: getCodeTemplate(projLanguage),
      createdBy: user._id,
      version,
    });

    return res.status(200).json({
      success: true,
      msg: "Project created successfully",
      project: project._id,
    });
  } catch (error) {
    console.error("Error in createProj:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const saveProject = async (req, res) => {
  try {
    const { projectId, code, token } = req.body;

    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while saving project",
      });
    }

    // Use $set to update only the code field
    const project = await projectModel.findOneAndUpdate(
      { _id: projectId },
      { $set: { code: code } }, // Use $set for specific field update
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }

    console.log("Project saved successfully:", project.name);

    return res.status(200).json({
      success: true,
      msg: "Project saved successfully",
    });
  } catch (error) {
    console.error("Error in saveProject:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while fetching projects",
      });
    }

    const projects = await projectModel.find({ createdBy: user._id });

    console.log("Fetched projects:", projects);
    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No projects found",
      });
    }
    return res.status(200).json({
      success: true,
      msg: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error in getProjects:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId, token } = req.body;

    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while fetching the mentioned project",
      });
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Project fetched successfully",
      project,
    });
  } catch (error) {
    console.error("Error in getProject:", error);

    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId, token } = req.body;
    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while deleting project",
      });
    }
    const project = await projectModel.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }
    console.log("Project deleted successfully:", project.name);
    return res.status(200).json({
      success: true,
      msg: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const editProject = async (req, res) => {
  try {
    const { token, projectId, name } = req.body;
    const decodedTokenInformation = jwt.verify(token, secret);
    const user = await userModel.findById(decodedTokenInformation.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized || User not found while editing project",
      });
    }
    const project = await projectModel.findByIdAndUpdate(
      projectId,
      { $set: { name: name } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        msg: "Project not found",
      });
    }
    console.log("Project updated successfully:", project.name);
    // Return the updated project details if needed
    return res.status(200).json({
      success: true,
      msg: "Project updated successfully",
      projectName: project.name,
    });
  } catch (error) {
    console.error("Error in editProject:", error);
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

export {
  signup,
  login,
  createProj,
  saveProject,
  getProjects,
  getProject,
  deleteProject,
  editProject,
};
