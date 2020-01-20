import axios from 'axios';
import addressSchema from '../Schemas/AddressSchema';

const API_URL = process.env.API_URL || 'http://localhost:5000';

const aURL = (customerId) => `${API_URL}/customers/${customerId}/addresses`;

export const getAddresses = async (cId, offset = 0) => {
  const result = await axios.get(aURL(cId), { params: { offset } });
  return result.data;
};

export const createAddress = async (cId, address) => {
  const data = address;
  data.customerId = cId;
  await addressSchema.validate(data);
  const result = await axios.post(aURL(cId), data);
  return result.data;
};
