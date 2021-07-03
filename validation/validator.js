const defaultOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

module.exports = (data, schema, options = defaultOptions) => schema.validateAsync(data, options);
