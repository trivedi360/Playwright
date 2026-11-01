/* codegen debuging tool: npx playwright test tests/06_getByLocators.spec.js --debug
 For Recording and generating code: npx playwright codegen https://rahulshettyacademy.com/client/#/auth/login
Adding Screenshort and trace(for log report): write some values in use of config.js file
    use {
        screenshot: 'on',
        trace: 'on'         or  trace: 'retain-on-failure'
    }
*/

const { test, expect } = require('@playwright/test');

test('Register on page', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userEmail = 'trivediashish@gmail.com';

    // Login to user
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByPlaceholder('email@example.com').fill(userEmail)
    await page.getByPlaceholder('enter your passsword').fill('Ab123456789@')
    await page.getByRole('button', {name: 'Login'}).click()
    await page.locator('.card-body b').first().waitFor();

    // Verify Name and click on Add to cart
    // await page.locator('.card-body b').filter('ZARA COAT 3').getByRole('button', {name: ' Add To Cart'}).click();
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
