const leadMagnetValidator = (req, res, next) => {
  const { name, company, email } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }

  if (!company || typeof company !== 'string' || company.trim().length < 2) {
    errors.push({ field: 'company', message: 'Company name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid work email is required.' });
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

module.exports = leadMagnetValidator;
