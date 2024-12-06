const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

export default async function handler(req, res) {
  try {
    const updates = [];
    const csvFilePath = path.join(
      __dirname,
      "../../../../../python/initial_data_seeding/Alpha migrating - CITIES.csv",
    );

    fs.createReadStream(csvFilePath)
      .pipe(
        csvParser({
          headers: ["ID", "city", "city_ascii", "lat", "lng", "fed", "province", "Timezone"],
        }),
      )
      .on("data", (row) => {
        if (row.city !== "city") {
          const updateSQL = `UPDATE cities SET timeZoneId = '${row.Timezone}' WHERE id = ${row.ID};`;
          updates.push(updateSQL);
        }
      })
      .on("end", () => {
        fs.writeFileSync("timezonesUpdate.sql", updates.join("\n"), "utf-8");
      });
  } catch (e) {
    console.error("Error with cities: ", e);
  }
}
