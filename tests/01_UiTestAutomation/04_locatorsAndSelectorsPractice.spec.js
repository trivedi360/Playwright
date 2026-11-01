const {test, expect} = require('@playwright/test');

test('Register on page', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Register User
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByText('Register here').click();
    // await page.locator('.login-wrapper p a').click();
    await page.locator('input[type="firstName"]').fill('Ashish');
    await page.locator('input[type = "lastName"]').fill('Raj');
    await page.locator('#userMobile').fill('1234500000')
    await page.locator('input[placeholder="email@example.com"]').fill('trivediashish@gmail.com');
    //Select Dropdown
    await page.locator('select[formcontrolname = "occupation"]').selectOption('Engineer');
    // Radio button
    await page.locator('input[value= "Male"]').check();
    await page.locator('input[type="checkbox"]').setChecked(true);
    await page.locator('#userPassword').fill('Ab123456789@');
    await page.locator('#confirmPassword').fill('Ab123456789@');
    await page.locator('#login').click();
    await page.locator('button[class="btn btn-primary"]').click();


    // Login to user
    // await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

    await page.locator('#userEmail').fill('trivediashish@gmail.com');
    await page.locator('#userPassword').fill('Ab123456789@');
    await page.locator('#login').click();
    // console.log(await page.locator('.card-body b').nth(0).textContent());
    // await page.waitForLoadState('domcontentloaded');
    await page.locator('.card-body b').first().waitFor();                   // waitFor() will work only for unique element
    const title = await page.locator('.card-body b').allTextContents();     //For using this we have to wait until the data is completly loded on UI. That is why using the above wait.
    console.log('Title available on UI:', title);
    await page.screenshot({ path: 'loginSuccessfully.png' });
})


test('Handle Dropdowns', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const username = page.locator('#username');
    const password = page.locator('#password');
    const dropdown = page.locator('select.form-control');
    await dropdown.selectOption('consult');

    // Radio button with Assertion
    await page.locator('.radiotextsty').last().click();
    await page.locator('#okayBtn').click();
    console.log(await page.locator('.radiotextsty').last().isChecked());        // Give true/false
    await expect(page.locator('.radiotextsty').last()).toBeChecked();         // radiotextsty: it should be checked otherwise it will return fail.
    
    // Checkbox with Assertion
    await page.locator('#terms').click();
    await expect(page.locator('#terms')).toBeChecked();
    await page.locator('#terms').uncheck();
    // Action is performed inside the brackets that is why we are using await inside the brackets.
    expect(await page.locator('#terms').isChecked()).toBeFalsy();        // There is no any function to check weather it is unchecked or not in expect. so we use toBeFalsy().
    

    //Assertions to check specific attribute is present or not.
    await expect(page.locator('[href *= "documents-request"]')).toHaveAttribute('class', 'blinkingText')
    // await page.pause();
})



test.only('Handle child/new window', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const textLink = page.locator('[href *= "documents-request"]');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // use promise because both the useActionState(80,81) are dependent and both should execute parallely then it will store new page.
    const [newPage] = await Promise.all(
        [
            context.waitForEvent('page'),     // This will contain any new pages opened by main page. Listen new page after this line executed. Means from now if any page will open then it is listen by it. But
            textLink.click()
        ]
    )

    const text = await newPage.locator('.red').textContent();
    console.log('Text on UI:', text);

    // Print the domain name by splitting the text.
    const domain = text.split('@')[1].split(' ')[0];
    // console.log('Domain name:', domain);
    // Paste the domain in username of parent tab
    await page.locator('#username').fill(domain);
    // textContent(): It will only work if the text is attached with dom. If There is an input box and we type something and want to console the typed text then we have to use inputValue() insted of textContent();
    console.log(`Domain Name: ${await page.locator('#username').inputValue()}`);
    // await page.pause();
})


