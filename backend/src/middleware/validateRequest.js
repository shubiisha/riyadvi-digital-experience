// Generic validation runner helper
const validateRequest = (validatorFn) => {
  return (req, res, next) => {
    if (typeof validatorFn === 'function') {
      return validatorFn(req, res, next);
    }
    next();
  };
};

module.exports = validateRequest;
