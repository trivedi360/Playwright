/*
If Id is present
CSS -> tagname#id (or) #id

If Class Attribute is present
CSS -> tagname.class (or) .class

Write css based on any attribute
css -> [attribute = 'value']

Write CSS with traversing from parent to child
css -> ParentTagName >> ChildTagName

If need to write locator based on text
text = ''
*/

const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

const practicePage = pathToFileURL(
    path.join(__dirname, 'locatorsAndSelectors.html'),
).href;

test.beforeEach(async ({ page }) => {
    await page.goto(practicePage);
});




// CSS selectors: #id, .class, [attribute="value"], and parent > child.
test('locates elements with CSS selectors', async ({ page }) => {
    // 1. ID — #id or tag#id
    await page.locator('#emailId').fill('alex@example.com');
    // Equivalent: page.locator('input#emailId')

    // 2. Class — .class or tag.class
    await page.locator('.login-form').isVisible();
    // Equivalent: page.locator('form.login-form')

    //3. Attribute — [attribute="value"]
    await page.locator('input[name="password"]').fill('secret');


    // Attribute selectors can also match partial values:
    page.locator('input[placeholder^="Email"]'); // starts with
    page.locator('input[name$="word"]');          // ends with
    page.locator('input[placeholder*="address"]'); // contains


    //4. Parent and child
    page.locator('form input');          // any input inside a form
    page.locator('form > button');       // button directly inside a form


    // 5. Text
    page.getByText('Sign in');
    page.getByRole('button', { name: 'Sign in' });


    // Other useful locators
    // Role and accessible name — usually a good first choice for buttons, links, and headings:
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('heading', { name: 'Account' }).isVisible();


    // Combining CSS conditions:
    page.locator('input[type="text"][name="username"]');


    //Selecting by position (use when the elements don’t have a better distinguishing attribute):
    page.locator('.menu-item').nth(1); // second matching item
});

test('Login using getByLable', async ({ page }) => {
    // Label, placeholder, and test ID:
    // await page.getByLabel('').fill('alex@example.com');
    await page.getByPlaceholder('Email address').fill('alex@example.com');
    await page.locator('input[name="password"]').fill('secret');
    await page.getByTestId('submit').click();
})


