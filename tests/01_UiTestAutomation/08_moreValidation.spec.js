const {test, expect} = require('@playwright/test');

test ('Learning More About Playwright', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    await page.goto('https://www.google.com/');
    await page.goBack();
    await page.goForward();
    await page.goBack();

    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();

    //page.on : this will run when the event occure anyware in the script
    await page.on('dialog', dialog => dialog.accept());                 // dialog.dismiss()
    // Now any ware in the script the popup will come the above line will handle it.
    // click on confirm to generate the popup
    await page.locator('#confirmbtn').click();

    // Hover
    await page.locator('#mousehover').hover();

    // Frames: We can access frames using id or frame-name. And use .frameLocator insted of locator
    const childFrame = page.frameLocator('#courses-iframe');
    await childFrame.locator("li a[href='lifetime-access']:visible").click();       // here :visible indicate only those elements which is visible
    const text = await childFrame.locator('.text h2').textContent();
    console.log(text?.split(' ')[1]);
})