const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find();
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const project = await Project.findOne({ slug });

  if (!project) {
    throw new ApiError(404, `Portfolio project with slug '${slug}' not found`);
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

module.exports = {
  getProjects,
  getProjectBySlug,
};
