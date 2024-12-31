const puppeteer = require("puppeteer");
const { timer } = require("./utils/timer");
const fs = require("fs");

const url =
  "https://vinpearl.com/vi/40-dia-diem-du-lich-viet-nam-noi-tieng-nhat-dinh-nen-den-mot-lan";

async function puppeteerSetUpAndReturnAWebPageAndBrowser(url, headless = true) {
  const browser = await puppeteer.launch({
    headless: headless,
    waitUntil: "domcontentloaded",
    slowMo: 500,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(url);
  // page.on("request", (request) => {
  //   console.log(request.url());
  // });
  return {
    page: page,
    browser: browser,
  };
}

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

async function run() {
  try {
    const { page, browser } = await puppeteerSetUpAndReturnAWebPageAndBrowser(
      url,
      false
    );

    const rawDestinations = await page.$$eval("h2", (elements) =>
      elements.map((e) => e.innerText)
    ); //did not pass robot test

    // const rawDestinations = await page.$$(
    //   "main > .main_container > .detail > h2"
    // );

    console.log(rawDestinations);

    try {
      // Save to TXT
      await fs.promises.writeFile(
        "destinations.txt",
        rawDestinations.join("\n"),
        "utf8"
      );

      // Save to CSV
      const csvContent = rawDestinations.map((dest) => `"${dest}"`).join("\n");
      await fs.promises.writeFile(
        "destinations.csv",
        "Destination\n" + csvContent,
        "utf8"
      );

      console.log("Data successfully saved to files");
    } catch (error) {
      console.error("Error saving files:", error);
    }

    await browser.close();
  } catch (err) {
    console.log(err.message);
  }
}

const execute = timer(run);
execute();
