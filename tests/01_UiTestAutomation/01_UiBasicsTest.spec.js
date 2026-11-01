const {test, expect} = require('@playwright/test');


// Here {browser} is called fixture
test('Open Browser with Page', async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://nikosta.in/');
});

test('Open Pge without Browser', async ({page}) => {
    await page.goto('https://www.google.com');

    // get - title - assertion
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
})

