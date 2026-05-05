// Middleware, joka validatoi reseptin luonti- ja muokkauspyynnöt Joi-kirjastolla

const Joi = require('joi');

const recipeSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Nimen pitää olla vähintään 3 merkkiä pitkä',
    'any.required': 'Nimi on pakollinen kenttä',
  }),
  description: Joi.string().max(1000).allow(''),
  image: Joi.string().allow(''),
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
  // Tarkistetaan onko kyseessä muokkaus (PUT tai PATCH)
  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
  const schemaToValidate = isUpdate
    ? recipeSchema.fork(Object.keys(recipeSchema.describe().keys), (schema) =>
        schema.optional(),
      )
    : recipeSchema;

  const { error, value } = schemaToValidate.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ errors: messages });
  }

  // TÄRKEÄÄ: Muokkauksessa emme halua korvata req.bodya oletusarvoilla (kuten image.default),
  // jos käyttäjä ei lähettänyt niitä. Luonnissa se on OK.
  req.body = isUpdate ? req.body : value;

  next();
};

module.exports = { validateRecipe };
