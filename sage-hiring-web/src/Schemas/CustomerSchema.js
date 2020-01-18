import Joi from '@hapi/joi';
import AddressSchema from './AddressSchema';

export default Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    additional: Joi.string().max(100),
    addresses: Joi.array().items(AddressSchema).min(1),
});
