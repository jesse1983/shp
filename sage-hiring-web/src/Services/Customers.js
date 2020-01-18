import axios from 'axios';
import customerSchema from '../Schemas/CustomerSchema';

const API_URL = process.env.API_URL || 'http://localhost:5000';


export const getCustomers = async (offset = 0) => {
    const result = await axios.get(`${API_URL}/customers`, { params: { offset } });
    return result.data;
};

export const createCustomer = async (data) => {
    await customerSchema(data);
    const result = await axios.post(`${API_URL}/customers`, { data });
    return result.data;
};
