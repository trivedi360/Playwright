const {test, expect} = require('@playwright/test');

test('Login Practice', async ({browser}) => {
    // Go to URL 
    const context = await browser.newContext();
    const page = await context.newPage();
    const cardTitle = page.locator('.card-body a');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    // Login Into page with Incorrect cred
    await page.locator('#username').fill('rahulshetty');             //type() is deprecated. Use fill() insted of it.
    await page.locator('#password').fill('Learning@830$3mK2');
    await page.locator('#terms').click();
    await page.locator('input#signInBtn').click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    // Again login with correct cred
    await page.locator('#username').fill('');
    await page.locator('#username').fill('rahulshettyacademy');
    await page.locator('input#signInBtn').click();


    // Get text from UI 
    // It will wait until the dom is completly loaded
    console.log(await page.locator('.card-body a').nth(0).textContent());
    console.log(await page.locator('.card-body a').first().textContent());
    // It will not wait and sometimes return array of 0 element no matter how much element are available. It will nit wait.
    const allTitles = await cardTitle.allTextContents();
    console.log('List of all the evements:', allTitles);
}) 