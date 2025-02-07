const fs = require("fs");

async function saveToTxt(dest, content) {
  try {
    await fs.promises.writeFile(dest, content.join("\n"), "utf8");

    console.log("Data successfully saved to files");
  } catch (error) {
    console.error("Error saving files:", error);
  }
}

async function saveToCsv(dest, content) {
  try {
    const csvContent = content.map((dest) => `"${dest}"`).join("\n");

    await fs.promises.writeFile(dest, "Destination\n" + csvContent, "utf8");
    console.log("Data successfully saved to files");
  } catch (error) {
    console.error("Error saving files:", error);
  }
}

module.exports = {
  saveToCsv,
  saveToTxt,
};
