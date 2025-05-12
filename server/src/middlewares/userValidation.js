const joi = require('joi');


exports.userValidation = joi.object({
  username: joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.base': 'Username should be a string',
      'string.empty': 'Username cannot be empty',
      'string.min': 'Username should have at least {#limit} characters',
      'string.max': 'Username should have at most {#limit} characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
      'any.required': 'Username is required'
    }),

  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
    .required()
    .messages({
      'string.base': 'Email should be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
      'string.base': 'Password should be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password should have at least {#limit} characters',
      'string.max': 'Password should have at most {#limit} characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),

  age: joi.number()
    .integer()
    .min(18)
    .max(100)
    .required()
    .messages({
      'number.base': 'Age should be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'You must be at least {#limit} years old',
      'number.max': 'Age must be {#limit} or less',
      'any.required': 'Age is required'
    }),

  gender: joi.string()
    .valid('Male', 'Female', 'Other', 'Prefer not to say')
    .required()
    .messages({
      'string.base': 'Gender should be a string',
      'string.empty': 'Gender cannot be empty',
      'any.only': 'Please select a valid gender',
      'any.required': 'Gender is required'
    })
});


exports.loginValidation = joi.object({
    email: joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required'
      }),
    password: joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });
  