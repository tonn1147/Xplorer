const puppeteer = require("puppeteer");
const { timer } = require("./utils/timer");
const fs = require("fs");
const { clickButtonAndWaitForNetwork } = require("./utils/clickBtn");
const { saveToCsv, saveToTxt } = require("./utils/files");

const searchResultTabPrefix = "tabs-content-";
const zoomToVietnamSelector = ".leaflet-control-layers-toggle";
const categorySelectPrefix = "category-select-";
const resultLimitSelector = ".result-limit";
let isResultLimitSetALl = false;
const searchResultId = "#search-results";
const firstLevelCategorySelector = ".category-marker";
const dataFileName =
  "https://paikkatietokonsultit.com/geoserver/travel_vietnam";

const url =
  "https://vnxplore.com/##p=&r=0&l=1.0546279422758869,78.00292968750001,29.458731185355344,125.06835937500003";
async function puppeteerSetUpAndReturnAWebPageAndBrowser(
  url,
  headless = false,
  slowMo = 0
) {
  const browser = await puppeteer.launch({
    headless: headless,
    waitUntil: "load",
    slowMo: slowMo,
    args: [
      "--start-maximized", // you can also use '--start-fullscreen'
    ],
    defaultViewport: null,
  });
  const page = await browser.newPage();

  //optional: set viewport as u need
  // await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(url, { waitUntil: "load" });
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
    // Listen for network responses
    // page.on("response", async (response) => {
    //   const url = response.url();
    //   if (
    //     url.startsWith(
    //       "https://paikkatietokonsultit.com/geoserver/travel_vietnam"
    //     )
    //   ) {
    //     try {
    //       const data = await response.text();
    //       responses.set(url, data);
    //       console.log("Captured response from:", url);
    //     } catch (error) {
    //       console.log("Error capturing response:", error.message);
    //     }
    //   }
    // });

    const result = {};

    try {
      // Get all category divs
      const categoryDivs = await page.$$(".category-marker");
      console.log("get all categories");
      for (const categoryDiv of categoryDivs) {
        // Get category name from <p> tag
        console.log("start looping");
        const categoryName = await categoryDiv.$eval(
          "p",
          (el) => el.textContent
        );
        result[categoryName] = {};
        console.log(result);
        // Get data-id from the div
        const dataId = await categoryDiv.evaluate((el) =>
          el.getAttribute("data-id")
        );

        // Find corresponding ul using the data-id
        const ulSelector = `#category-${dataId}-list`;
        const ul = await page.$(ulSelector);

        console.log(ul);
        if (ul) {
          // Get all li elements in this ul
          console.log("Get all li elements in this ul");
          const liElements = await ul.$$("li");
          console.log(liElements);
          for (const li of liElements) {
            // Get subcategory name from strong tag
            console.log("Get subcategory name from strong tag");
            const subcategoryName = await li.$eval(
              "strong",
              (el) => el.textContent
            );
            result[categoryName][subcategoryName] = [];

            // Click the li element
            await li.evaluate((e) => {
              console.log("click button");
              e.click();
            });
            console.log("Wait for network request and response");
            // Wait for network request and response
            const response = await page.waitForResponse(async (response) =>
              response.url().startsWith(dataFileName)
            );
            // Get the response text and parse it
            console.log("Get the response text and parse it");
            const responseText = await response.text();
            // Remove 'getJson4001(' from start and ')' from end
            const jsonStr = responseText
              .replace(/^getJson\d+\(/, "")
              .replace(/\)$/, "");
            const data = JSON.parse(jsonStr);
            // Extract and transform the features
            const transformedFeatures = data.features.map((feature) => ({
              geometry: feature.geometry,
              description: feature.properties.description_en,
              name: feature.properties.name_en,
              imageUrl: feature.properties.img_url,
            }));

            // Add transformed features to result
            result[categoryName][subcategoryName] = transformedFeatures;

            // Find and click the close button
            await page.$eval("button.ui-icon-close", (e) => {
              console.log("click close button");
              e.click();
            });
            console.log("process result successfully");
          }
        }
      }
      await saveToTxt("destinations.txt", JSON.stringify(result));
    } catch (err) {
      throw new Error(err);
    }
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
