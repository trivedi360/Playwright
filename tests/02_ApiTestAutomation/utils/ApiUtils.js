class ApiUtils {

    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        // Use the correct URL not the regular URL. Because this is API call so we have to use the API URL.
        const loginResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
            {
                data: this.loginPayLoad
            }
        );
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;
    }

    async getOrderIds(orderPayLoad) {
        // To check order is placed successfully or not.
        const response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',
            {
                data: orderPayLoad,
                headers:
                {
                    authorization: response.token,
                    'content-type': 'application/json'
                }
            }
        );
        // expect(orderResponse.ok()).toBeTruthy();
        const orderResponseJson = await orderResponse.json();
        console.log('OrderResponseJson: ', orderResponseJson);
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
    }
}

module.exports = { ApiUtils };