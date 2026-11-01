const { test, expect, request } = require('@playwright/test');
const loginPayLoad = { userEmail: 'trivediashish@gmail.com', userPassword: 'Ab123456789@' }
const orderPayLoad = { orders: [{ country: "Aruba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }
let token;
let orderId;

test.beforeAll(async () => {
    // For directly Login to API and get the token.
    const apiContext = await request.newContext();
    // Use the correct URL not the regular URL. Because this is API call so we have to use the API URL.
    const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
        {
            data: loginPayLoad
        }
    );
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;


    // To check order is placed successfully or not.
    const orderResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',
        {
            data: orderPayLoad,
            headers:
            {
                authorization: token,
                'content-type': 'application/json'
            }
        }
    );
    // expect(orderResponse.ok()).toBeTruthy();
    const orderResponseJson = await orderResponse.json();
    console.log('OrderResponseJson: ', orderResponseJson);
    orderId = orderResponseJson.orders[0];
})

test('Place order', async ({ page }) => {
    // We got the Token above now we have to inject it into browser. For that Playwright doesn't provide any functionality. So we use JS to insert it in browser.
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);


    // Placing Order
    await page.goto('https://rahulshettyacademy.com/client/#/dashboard/dash');
    await page.locator("button[routerlink*='myorder']").click();
    const rows = page.locator("tbody tr");
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }




})