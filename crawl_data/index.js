const puppeteer = require("puppeteer");
const { timer } = require("./utils/timer");
const fs = require("fs");
const { clickButtonAndWaitForNetwork } = require("./utils/clickBtn");

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
    // Store responses
    const responses = new Map();

    // Listen for network responses
    page.on("response", async (response) => {
      const url = response.url();
      if (
        url.startsWith(
          "https://paikkatietokonsultit.com/geoserver/travel_vietnam"
        )
      ) {
        try {
          const data = await response.text();
          responses.set(url, data);
          console.log("Captured response from:", url);
        } catch (error) {
          console.log("Error capturing response:", error.message);
        }
      }
    });

    await page.waitForSelector(".category-nav-select-all");

    // Get all unique data-type values
    const dataTypes = await page.evaluate(() => {
      const buttons = document.querySelectorAll(".category-nav-select-all");
      return [
        ...new Set(
          [...buttons].map((button) => button.getAttribute("data-type"))
        ),
      ];
    });

    console.log(`Found ${dataTypes.length} different data-types:`, dataTypes);

    // Process each data-type sequentially
    for (const dataType of dataTypes) {
      console.log(`Processing data-type: ${dataType}`);

      try {
        // Wait for and get the specific button
        const selectAllButtonSelector = `.category-nav-select-all[data-type="${dataType}"]`;
        await page.waitForSelector(selectAllButtonSelector, { visible: true });

        // Use evaluate to click the button
        await page.evaluate((selector) => {
          const button = document.querySelector(selector);
          if (button) {
            button.click();
          } else {
            throw new Error(`Button not found for selector: ${selector}`);
          }
        }, selectAllButtonSelector);

        console.log(`Clicked "select all" for data-type ${dataType}`);

        // Wait for potential network request
        try {
          await page.waitForResponse(
            (response) =>
              response
                .url()
                .startsWith(
                  "https://paikkatietokonsultit.com/geoserver/travel_vietnam"
                ),
            { timeout: 30000 }
          );
        } catch (timeoutError) {
          console.log(
            `No matching network request found for data-type ${dataType}`
          );
        }

        // Get response content
        const responses = await page.evaluate(async () => {
          try {
            const entries = performance
              .getEntriesByType("resource")
              .filter((entry) =>
                entry.name.startsWith(
                  "https://paikkatietokonsultit.com/geoserver/travel_vietnam"
                )
              );

            if (entries.length === 0) return [];

            const fetchResponses = await Promise.all(
              entries.map(async (entry) => {
                try {
                  const response = await fetch(entry.name);
                  const content = await response.text();
                  return {
                    url: entry.name,
                    content: content,
                  };
                } catch (error) {
                  return {
                    url: entry.name,
                    error: error.message,
                  };
                }
              })
            );
            return fetchResponses;
          } catch (error) {
            return { error: error.message };
          }
        });

        // Log responses for current data-type
        if (responses.length > 0) {
          console.log(`Responses for data-type ${dataType}:`);
          responses.forEach((response) => {
            console.log(`URL: ${response.url}`);
            if (response.error) {
              console.log("Error:", response.error);
            } else {
              console.log("Content:", response.content);
            }
            console.log("-------------------");
          });
        }

        // Click the corresponding "select none" button using evaluate
        const selectNoneButtonSelector = `.category-nav-select-none[data-type="${dataType}"]`;
        await page.waitForSelector(selectNoneButtonSelector, { visible: true });
        await page.evaluate((selector) => {
          const button = document.querySelector(selector);
          if (button) {
            button.click();
          } else {
            throw new Error(`Button not found for selector: ${selector}`);
          }
        }, selectNoneButtonSelector);

        console.log(`Clicked "select none" for data-type ${dataType}`);

      } catch (error) {
        console.error(`Error processing data-type ${dataType}:`, error);
        // Take a screenshot when error occurs
        await page.screenshot({ path: `error-data-type-${dataType}.png` });
        continue;
      }
    }

    console.log("All data-types processed successfully");

    await new Promise(() => setTimeout(() => console.log("waiting"), 10000));
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
