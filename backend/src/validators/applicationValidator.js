const applicationValidator = (req, res, next) => {
  const { name, email, phone, position } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email address is required.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'Valid phone number is required.' });
  }

  if (!position || typeof position !== 'string') {
    errors.push({ field: 'position', message: 'Target position is required.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Application form validation failed',
      errors,
    });
  }

  next();
};

module.exports = applicationValidator;
