const contactValidator = (req, res, next) => {
  const { name, email, requirement } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address.' });
  }

  if (!requirement || typeof requirement !== 'string' || requirement.trim().length < 3) {
    errors.push({ field: 'requirement', message: 'Please specify your requirement.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = contactValidator;
