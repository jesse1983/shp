import axios from 'axios';
import customerSchema from '../Schemas/CustomerSchema';

const API_URL = process.env.API_URL || 'http://localhost:5000';


export const getCustomers = async (offset = 0) => {
    const result = await axios.get(`${API_URL}/customers`, { params: { offset } });
    return result.data;
};

export const getCustomer = async (id) => {
    const result = await axios.get(`${API_URL}/customers/${id}`);
    return result.data;
};

export const createCustomer = async (data) => {
    await customerSchema.validate(data);
    const result = await axios.post(`${API_URL}/customers`, data);
    return result.data;
};

export const updateCustomer = async (data) => {
    await customerSchema.validate(data);
    const result = await axios.put(`${API_URL}/customers/${data.customerId}`, data);
    return result.data;
};

export const destroyCustomer = async (id) => {
    await axios.delete(`${API_URL}/customers/${id}`);
    return true;
};

