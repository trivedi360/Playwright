// getByLable, getByRole, getByText, Method chaining
// npx playwright test --ui: Open playwright test runner.
// getByLable: It will work only if input tag is also tagged inside lable. Or if there is any linkage like lable has 'for' attribute's value is same as input 'id' attribute's value.

const {test, expect} = require('@playwright/test');

test('GetBy Locators', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    // We use getByLable only when click krne se uspr select ho jata ho. Sometimes not work in textbox. That is why ue use it in checkbox and select options
    await page.getByLabel('Check me out if you Love IceCreams!').check();
    await page.getByLabel('Employed').check();
    await page.getByLabel('Gender').selectOption('Male');
    await page.getByPlaceholder('Password').fill('abc123');
    await page.getByRole('button', {name:'Submit'}).click();        // it will work either there is button tag or btn as class name
    await page.getByText('Success! The Form has been submitted successfully!.').isVisible();            // This will give boolean value
    // It will wait for 5 sec by default. This is step level. For Global level we hhave to change in .config file. 
    await expect(page.getByText('Successs! The Form has been submitted successfully!.')).toBeVisible({timeout: 10_000})   // This will either pass or fails. This is called assertions.
    await page.getByRole('link', {name: 'Shop'}).click();

    await page.locator('app-card').filter({hasText: 'Nokia Edge'}).getByRole('button').click();
    await page.locator('li').filter({ hasText: /Checkout\s*\(\s*\d+\s*\)/ }).click();
})

/* If we have to wait/slower then we can do this on 3 different level: 
Global Level: By changing in .config file
Test Level: By below method
Step level: By using {timeout: 1000}
*/
test('Use wait for test level', async ({page}) => {
    const slowExpect = expect.configure({timeout: 9000});
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.getByRole('button', {name:'Submit'}).click();  
    // insted of expect we use slowExpect if the text appears bit slower. This is test level
    await slowExpect(page.getByText('Success! The Form has been submitted successfully!.')).toBeVisible();
})

/*
In config.js file there is 'timeout: 40*1000,' timeout that defines how much time it will take to execute the each test. That means in 40sec the each test will completely executed.
But if only one test will take more time then no need to change it globally. We just use "test.setTimeout(6000). Now the specific test will take 6sec to execute completly.
All the actions will take 60sec or 40sec(if 60sec is not defined). If we need to change the time for actions, we need to declear in config.js file (actionTimeout:10*1000). It help like if we know that specific action will take 10 sec and we didn't defined any specific action in config.js. Then the test will wait unnecessary for 60sec because the default test time is 60sec.
If we have to handle actions for test level then we define "page.setDefaultTimeout(9000)".
    SO there are 3 levels for actions also: 
    Global Level- actionTimeout: 10*1000
    Test level- page.setDefaultTimeout(9000)
    Step Level- {timeout: 15000}

Priority: Step -> Test -> Global

navigationTimeoout: 30*1000 - If we set timeout in navigating on URL (goto). If we don't write this in config.js then it will follow test timeout (timeout: 40*1000).

waitfor(): it will wait to load the locators. It will wait based on test timeout.
*/
test('Use of timeout', async ({page}) => {
    test.setTimeout(60000);                 // This test will execute completely within 60sec otherwise it will fails.
    page.setDefaultTimeout(9000);
    const slowExpect = expect.configure({timeout: 9000});
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.getByRole('button', {name:'Submit'}).click();                // This click will wait for 10sec because it is defined in config.js (actionTimeout:10*1000). Global level

    // For this particular action it will wait for 15sec. Step level
    await page.getByRole('link', {name: 'Shop'}).click({timeout: 15000});


})