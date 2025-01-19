async function saveToTxt(from, to,content) {
  await fs.promises.writeFile(
    "destinations.txt",
    rawDestinations.join("\n"),
    "utf8"
  );
}

async function saveToCsv(from,to,content) {
    
}

try {
  // Save to TXT

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
