const healthCheckupValidator = (req, res, next) => {
  const { companyName, contactPerson, email } = req.body;
  const errors = [];

  if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
    errors.push({ field: 'companyName', message: 'Company name is required.' });
  }

  if (!contactPerson || typeof contactPerson !== 'string' || contactPerson.trim().length < 2) {
    errors.push({ field: 'contactPerson', message: 'Contact person name is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid corporate email is required.' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed on Health Checkup form.',
      errors,
    });
  }

  next();
};

module.exports = healthCheckupValidator;
