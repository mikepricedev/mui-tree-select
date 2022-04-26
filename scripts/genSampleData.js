const https = require("https");
const fs = require("fs");
const path = require("path");

(async () => {
  const [resJSON, resLicense] = await Promise.all([
    new Promise((resolve, reject) =>
      https
        .get(
          "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json",
          resolve
        )
        .on("error", reject)
    ),
    new Promise((resolve, reject) =>
      https
        .get(
          "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/LICENSE",
          resolve
        )
        .on("error", reject)
    ),
  ]);

  if (resJSON.statusCode !== 200) {
    throw new Error("Request Failed.\n" + `Status Code: ${resJSON.statusCode}`);
  } else if (resLicense.statusCode !== 200) {
    throw new Error(
      "Request Failed.\n" + `Status Code: ${resLicense.statusCode}`
    );
  }

  const [rawObj, license] = await Promise.all([
    new Promise((resolve, reject) => {
      let rawData = "";
      resJSON.setEncoding("utf8");
      resJSON.on("data", (chunk) => {
        rawData += chunk;
      });

      resJSON.on("end", () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (e) {
          reject(e);
        }
      });
    }),
    new Promise((resolve) => {
      let rawData = "";
      resLicense.setEncoding("utf8");
      resLicense.on("data", (chunk) => {
        rawData += chunk;
      });

      resLicense.on("end", () => {
        resolve(rawData);
      });
    }),
  ]);

  const db = rawObj.map(({ id: countryId, name, emoji, states = [] }) => ({
    id: countryId.toString(),
    name,
    emoji,
    states: states.map(({ id, name, cities = [] }) => {
      const stateId = `${countryId}-${id}`;
      return {
        id: stateId,
        name,
        cities: cities.map(({ id, name }) => ({
          id: `${stateId}-${id}`,
          name,
        })),
      };
    }),
  }));

  await Promise.all([
    fs.promises.writeFile(
      path.resolve(__dirname, "../src/example/db/sampleData.ts"),
      `const db = ${JSON.stringify(db)};
      export default db;
      `,
      { flag: "w+" }
    ),
    fs.promises.writeFile(
      path.resolve(__dirname, "../src/example/db/sampleData_LICENSE.md"),
      `#[Countries States Cities Database](${"https://github.com/dr5hn/countries-states-cities-database"})\n\n${license}`,
      { flag: "w+" }
    ),
  ]);
})();
