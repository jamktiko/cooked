const Joi = require('joi');

const recipeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Nimen pitää olla vähintään 3 merkkiä pitkä',
    'any.required': 'Nimi on pakollinen kenttä',
  }),
  description: Joi.string().max(1000).allow(''),
  image: Joi.string().uri().allow('').default('Tähän oletuskuvan URL!'),
  public: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()),
  ingredients: Joi.array()
    .items(
      Joi.object({
        amount: Joi.number().min(0).required(),
        unit: Joi.string().allow(''),
        name: Joi.string().required(),
      }),
    )
    .min(1)
    .required(),
  directions: Joi.array().items(Joi.string()),
  servings: Joi.number().min(1).default(1),
  duration: Joi.number().min(0).default(0),
});

const validateRecipe = (req, res, next) => {
  const { error, value } = recipeSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }
  req.body = value;
  next();
};

module.exports = { validateRecipe };
