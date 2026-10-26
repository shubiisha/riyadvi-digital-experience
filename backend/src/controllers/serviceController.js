const Service = require('../models/Service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find();
  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

const getServiceBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const service = await Service.findOne({ slug });

  if (!service) {
    throw new ApiError(404, `Service with slug '${slug}' not found`);
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

module.exports = {
  getServices,
  getServiceBySlug,
};
