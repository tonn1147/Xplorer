/**
 *
 * @param {object} button button needs to be clicked for navigating
 * @param {object} page button's page
 * @returns true if clicked successfully, otherwise false
 */
async function clickButtonForNavigating(button, page) {
  if (button) {
    await button.click();
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    console.log("navigation button was clicked");
    return true;
  } else {
    console.log("navigation button was not clicked");
    return false;
  }
}

async function clickButtonAndWaitForSelectorVisible(
  button,
  page,
  selector = null
) {
  if (button) {
    await button.click();
    if (selector) await page.waitForSelector(selector, { visible: true });
    console.log("button was clicked");
    return true;
  } else {
    console.log("button was not clicked");
    return false;
  }
}

async function clickButtonAndWaitForSelectorHidden(
  button,
  page,
  selector = null
) {
  if (button) {
    await button.click();
    if (selector) await page.waitForSelector(selector, { hidden: true });
    console.log("button was clicked");
    return true;
  } else {
    console.log("button was not clicked");
    return false;
  }
}

async function clickButtonAndWaitForNetwork(button, page, url = null) {
  if (button) {
    await button.click();
    if (selector) await page.waitForResponse(url);
    console.log("button was clicked");
    return true;
  } else {
    console.log("button was not clicked");
    return false;
  }
}
