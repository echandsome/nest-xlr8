import axios from 'axios';
import { 
    IBigCommerceCustomer, 
    IBigCommerceCustomerAddress, 
    IBigCommerceCustomerAddresses, 
    IBigCommerceCustomers, IBigCommerceOrder, IBigCommerceProducts } from '@/shared/interfaces';
let targetUrl = 'https://api.bigcommerce.com/stores/{store_hash}/';

const getOrderById = async (store_hash: string, order_id: string, token: string): Promise<IBigCommerceOrder> => {
    try {
        let url = targetUrl.replace('{store_hash}', store_hash);
        url = url + 'v2/orders/' + order_id;

        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        };
    
        const response = await axios.get(url, options);
    
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get order by id: ${order_id} - ${error.response?.data?.message || error.message}`);
    }
    
}

const getCustomerById = async (store_hash: string, customer_id: number, token: string): Promise<IBigCommerceCustomer> => {
    try {
        let url = targetUrl.replace('{store_hash}', store_hash);
        url = url + 'v3/customers?id:in=' + customer_id;

        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        };
    
        const response = await axios.get<IBigCommerceCustomers>(url, options);
    
        return response.data.data[0];
    } catch (error) {
        throw new Error(`Failed to get customer by id: ${customer_id} - ${error.response?.data?.message || error.message}`);
    }
}

const getCustomerAddressById = async (store_hash: string, customer_id: number, token: string): Promise<IBigCommerceCustomerAddress> => {
    try {
        let url = targetUrl.replace('{store_hash}', store_hash);
        url = url + 'v3/customers/addresses?id:in=' + customer_id;
        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        };
        const response = await axios.get<IBigCommerceCustomerAddresses>(url, options);
        return response.data.data[0];
    } catch (error) {
        throw new Error(`Failed to get customer addresses by id: ${customer_id} - ${error.response?.data?.message || error.message}`);
    } 
}

const getProductById = async (store_hash: string, order_id: string, token: string): Promise<IBigCommerceProducts> => {
    try {
        let url = targetUrl.replace('{store_hash}', store_hash);
        url = url + 'v2/orders/' + order_id + '/products';
        let options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            }
        };
        const response = await axios.get(url, options);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get product by id: ${order_id} - ${error.response?.data?.message || error.message}`);
    }
}

export { 
    getOrderById, 
    getCustomerById, 
    getCustomerAddressById,
    getProductById 
};
