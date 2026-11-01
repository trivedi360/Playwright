const { test, expect, request } = require('@playwright/test');
const { ApiUtils } = require('./utils/ApiUtils');
const loginPayLoad = { userEmail: 'trivediashish@gmail.com', userPassword: 'Ab123456789@' }
const orderPayLoad = { orders: [{ country: "Aruba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }
let token;
let orderId;

test.beforeAll(async () => {
    // For directly Login to API and get the token.
    const apiContext = await request.newContext();
    const apiUtils =new ApiUtils(apiContext, loginPayLoad);
    const response = await apiUtils.getOrderIds(orderPayLoad);
    token = response.token;
    orderId = response.orderId;
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