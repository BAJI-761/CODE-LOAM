/**
 * Zod Request Validation Middleware
 * Validates req.body, req.query, or req.params against a Zod schema.
 */
const { z } = require('zod');
const ApiError = require('../utils/ApiError');

/**
 * Creates a validation middleware for the given schema.
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Which part of the request to validate
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const errors = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        throw new ApiError(400, errors[0].message, errors);
      }
      // Replace with parsed (coerced/default) values
      req[source] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
