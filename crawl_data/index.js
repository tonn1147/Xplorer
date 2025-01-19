const puppeteer = require("puppeteer");
const { timer } = require("./utils/timer");
const fs = require("fs");

const searchResultTabPrefix = "tabs-content-";
const zoomToVietnamSelector = ".leaflet-control-layers-toggle";
const categorySelectPrefix = "category-select-";
const resultLimitSelector = ".result-limit";
let isResultLimitSetALl = false;
const searchResultId = "#search-results";
const firstLevelCategorySelector = ".category-marker";
const dataFileName =
  "https://paikkatietokonsultit.com/geoserver/travel_vietnam";

const url = "https://vnxplore.com/##p=&r=0&l=1.0546279422758869,78.00292968750001,29.458731185355344,125.06835937500003";
async function puppeteerSetUpAndReturnAWebPageAndBrowser(
  url,
  headless = false,
  slowMo = 0
) {
  const browser = await puppeteer.launch({
    headless: headless,
    waitUntil: "domcontentloaded",
    slowMo: slowMo,
    args: [
      "--start-maximized", // you can also use '--start-fullscreen'
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  //optional: set viewport as u need
  // await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(url, { waitUntil: "networkidle2" });
  return {
    page: page,
    browser: browser,
  };
}

async function run() {
  const { page, browser } = await puppeteerSetUpAndReturnAWebPageAndBrowser(
    url,
    false
  );
  try {
    const jsonObjectResult = {};
    page.on("response", async (response) => {
      try {
        const url = response.url();
        if (url.startsWith("https://paikkatietokonsultit.com/geoserver/travel_vietnam")) {
          console.log("intercept response");
          console.log(await response.text());
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    (await page.$$(".category-nav-select-all")).forEach;
    // let numberOfFirstLevelCategory = 0;

    // const firstLevelCategoryList = await page.$$eval(`${firstLevelCategorySelector} p`, (p) => {
    //   return p.map(p => p.innerText);
    // });

    // numberOfFirstLevelCategory = firstLevelCategoryList.length;
    // firstLevelCategoryList.forEach((p,i) => {
    //   jsonObjectResult[`${p}`] = {};

    // });

    // [class*=${categorySelectPrefix}] to select all
    // try {
    //   await page.$$eval(`#category-1-list > *`, (items) => {
    //     items.forEach((item) => {
    //       console.log(item.classList.toString());
    //     });
    //   });
    // } catch (err) {
    //   console.log(err.message);
    // }

    await new Promise(() => setTimeout(() => console.log("waiting"), 10000));

    console.log(jsonObjectResult);

    // try {
    //   // Save to TXT
    //   await fs.promises.writeFile(
    //     "destinations.txt",
    //     rawDestinations.join("\n"),
    //     "utf8"
    //   );

    //   // Save to CSV
    //   const csvContent = rawDestinations.map((dest) => `"${dest}"`).join("\n");
    //   await fs.promises.writeFile(
    //     "destinations.csv",
    //     "Destination\n" + csvContent,
    //     "utf8"
    //   );

    //   console.log("Data successfully saved to files");
    // } catch (error) {
    //   console.error("Error saving files:", error);
    // }
  } catch (err) {
    console.log(err.message);
  } finally {
    await browser.close();
  }
}

try {
  const execute = timer(run);
  execute();
} catch (err) {
  console.log(err.message);
}
