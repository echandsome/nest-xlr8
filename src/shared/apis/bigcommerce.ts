import axios from 'axios';
let templateUrl = 'https://api.bigcommerce.com/stores/{store_hash}/v2/orders/{order_id}';

const getOrderById = async (store_hash: string, order_id: string, token: string) => {
    try {
        let url = templateUrl.replace('{store_hash}', store_hash);
        url = url.replace('{order_id}', order_id);

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

export { getOrderById };
