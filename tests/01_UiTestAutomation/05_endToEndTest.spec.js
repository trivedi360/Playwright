/*
Go to: https://rahulshettyacademy.com/client/#/auth/login

Register if not done previously, then login.



Landed to Dashboard. Select 1 product and Add to the cart it.

Click on Cart button and you will landed to cart section.



Landed to My cart and verify the product by its name.

Then click on Checkout button.



Now you landed on checkout page. Verify name and quantity of product.

Add payment method details like CC number, cvv.. etc.
Verify the email id which is already available and same.

Select country from dropdown.

Apply coupon. And After applyed the text of successfully applied is showed.

Click on Place Order.



Landed on confirmation Page.

Verify Text ThankYou for the order.

capture the order id inside the variable

Click on orders history page



Landed on Your Order

Search for the order id

click on view button of that particular order id

Validate the details again
*/



const { test, expect } = require('@playwright/test');

test('Register on page', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const userEmail = 'trivediashish@gmail.com';

    // Login to user
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(userEmail);
    await page.locator('#userPassword').fill('Ab123456789@');
    await page.locator('#login').click();
    await page.locator('.card-body b').first().waitFor();

    // Add to cart:1st Approach
    const titles = await page.locator('.card-body b').allTextContents();
    const productIndex = titles.findIndex(title => title === 'ZARA COAT 3');
    // // await page.pause();
    // await page.locator('.w-10').nth(productIndex).click();
    // await page.locator('[routerlink="/dashboard/cart"]').click();

    // 2nd Approach
    const cardDetails = page.locator('.card-body');
    const totalProducts = await cardDetails.count();
    for (let i = 0; i < totalProducts; i++) {
        if (await cardDetails.nth(i).locator('b').textContent() === 'ZARA COAT 3') {
            await cardDetails.nth(i).locator('text= Add To Cart').click();              // Select based on text
            break;
        }
    }

    await page.locator('[routerlink*="cart"]').click();
    // My cart Page
    await expect(page.locator('.heading.cf h1')).toContainText('My Cart');
    // await expect(page.locator('.cartSection h3')).toContainText(titles[productIndex]);
    // OR
    //await page.locator('div li').waitFor();         // wait because .isVisible don't have auto wait machanisms that is why we explicitely write.
    await page.locator('div li').first().waitFor();     // above is showing error because of multiple elements getting
    const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible();
    expect(bool).toBeTruthy();
    //click on checkout
    await page.locator('.totalRow button.btn.btn-primary').click();

    // Payment Page
    await expect(page.locator('.item__details .item__title')).toContainText(titles[productIndex]);
    await expect(page.locator('.item__details .item__quantity')).toContainText('Quantity: 1');
    await page.locator('.field.small .input.txt').nth(0).fill('123')
    await page.locator('[name="coupon"]').fill('rahulshettyacademy');
    await page.locator('.field.small .btn.btn-primary.mt-1').click();

    await expect(page.locator('.mt-1.ng-star-inserted')).toContainText('* Coupon Applied');
    //await page.locator('[placeholder="Select Country"]').fill('India');     // We can't use fill because it will just paste whatever you write. But we need to fill slowly in it.
    await page.locator('[placeholder="Select Country"]').pressSequentially('ind', { delay: 150 });
    await page.locator('.ta-results.list-group.ng-star-inserted').waitFor();
    await page.getByRole('button', { name: /India$/ }).click();
    //Get Email
    console.log()
    await expect(page.locator(".user__name.mt-5 label[type='text']")).toHaveText(userEmail);
    await page.locator('.btnn.action__submit').click();
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ')
    // const orderId = (await page.locator("label[class='ng-star-inserted']").innerText())
    //     .replace(/\|/g, '')
    //     .trim();                                                        // 6ae496faa90a419aa83547ef
    const orderId = await page.locator("label[class='ng-star-inserted']").textContent();
    console.log(orderId);                                               // | 6ae496faa90a419aa83547ef | 
    await page.locator('text= Orders History Page ').click();

    // Method 1
    const ordersTable = page.locator("tbody tr");
    await ordersTable.first().waitFor();
    for (let i = 0; i < await ordersTable.count(); i++) {
        const rowOrderId = await ordersTable.locator('th').nth(i).textContent();
        if (orderId.includes(rowOrderId)) {
            await ordersTable.nth(i).locator("button").first().click();
            break;
        }
    }
    // Method 2
    // const orderRow = page.getByRole('row').filter({
    //     has: page.getByRole('rowheader', { name: orderId, exact: true })
    // });
    // await expect(orderRow).toHaveCount(1);
    // await orderRow.getByRole('button', {name: 'View'}).click();

    // Order Summery Page
    await page.locator('.email-title').waitFor();
    await expect(page.locator('div .email-title')).toHaveText('order summary')



    // Get order Id from table
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    await page.screenshot({ path: 'loginSuccessfully.png' });

})
