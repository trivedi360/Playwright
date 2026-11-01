// In this script we are opening browser and login to the application and save the session and cookies in state.json file. In next test we are using that state.json file to open the application without login again. This is usefule when there are multiple cookies, session and local storage data. So we can save all of them in state.json file and use it in next test. 
// This is also useful when we have to run the test in multiple browsers. We can save the state.json file in one browser and use it in another browser. This is also useful when we have to run the test in multiple browsers. We can save the state.json file in one browser and use it in another browser.
/* Debug code when you introduce API: In package.json file add:

"scripts": {
    "test": "npx playwright test tests/02_ApiTestAutomation/02_ApiUsingUtils.spec.js --headed"
  }
    Then shift+control+p: and search 'debug npm script'. You can also add breakpoint by click on any line.
*/

const {test, expect} = require('@playwright/test');
let webContext;
test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByPlaceholder('email@example.com').fill('trivediashish@gmail.com')
    await page.getByPlaceholder('enter your passsword').fill('Ab123456789@')
    await page.getByRole('button', {name: 'Login'}).click()
    await page.locator('.card-body b').first().waitFor();
    await context.storageState({path: 'state.json'});
    webContext = await browser.newContext({storageState: 'state.json'});
})

test('Session And cookies', async () => {
    // No need to login again because we have already logged in and saved the session and cookies in state.json file. So we can use that state.json file to open the application without login again.
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');

    // Verify Name and click on Add to cart
    await page.locator('.card-body').filter({ hasText: 'ZARA COAT 3' }).getByRole('button', { name: 'Add To Cart' }).click();
    // Click on Cart: Use listItems so that it cannot select Add To Cart
    await page.getByRole('listitem').getByRole('button', {name:'Cart'}).click();

    // My cart Page
    await expect(page.getByText('My Cart')).toBeVisible();
    
    await page.locator('div li').first().waitFor();
    await expect(page.getByText('ZARA COAT 3')).toBeVisible();
  
    //click on checkout
    await page.getByRole('button', {name: 'Checkout'}).click();

    // Payment Page
    await expect(page.getByText('ZARA COAT 3')).toBeVisible();
    await expect(page.getByText('Quantity: 1')).toBeVisible();

    await page.getByPlaceholder('Select Country').pressSequentially('ind', {delay: 150});
    await page.getByRole('button', {name: 'India'}).nth(1).click();
    await page.getByText('PLACE ORDER').click();
    await expect(page.getByText('Thankyou for the order.')).toBeVisible();
})

test('Get Title', async () => {
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    const title = await page.locator('.card-body b').allTextContents();
    console.log(title);
})