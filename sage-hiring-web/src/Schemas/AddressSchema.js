import Joi from '@hapi/joi';

export default Joi.object({
  addressId: Joi.number(),
  title: Joi.string().min(3).required().label('Address title'),
  streetNumber: Joi.string().required().label('Street'),
  additional: Joi.string().label('Additional address').allow(null),
  street: Joi.string().min(2).required().label('Street'),
  district: Joi.string().min(3).required().label('District'),
  city: Joi.string().min(3).required().label('City'),
  state: Joi.string().min(2).required().label('State'),
  country: Joi.string().min(3).required().label('country'),
  latitude: Joi.number().label('Latitude').allow(null),
  longitude: Joi.number().label('Longitude').allow(null),
  customerId: Joi.number().integer().allow(null),
});
