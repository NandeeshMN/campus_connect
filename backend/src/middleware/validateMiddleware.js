const validate = (schema) => {
  return (req, res, next) => {
    // A simple schema validator middleware helper.
    // In production, you would run validations using a library like Joi or express-validator.
    const errors = [];
    const fields = Object.keys(schema);

    for (const field of fields) {
      const rules = schema[field];
      const val = req.body[field];

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`${field} is required.`);
        continue;
      }

      if (val !== undefined && val !== null) {
        if (rules.type && typeof val !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}.`);
        }
        if (rules.pattern && !rules.pattern.test(val)) {
          errors.push(`${field} format is invalid.`);
        }
        if (rules.minLength && val.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters.`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
};

module.exports = validate;
