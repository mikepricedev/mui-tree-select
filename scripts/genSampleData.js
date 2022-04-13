const https = require("https");
const fs = require("fs");
const path = require("path");

(async () => {
  const res = await new Promise((resolve, reject) =>
    https
      .get(
        "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json",
        resolve
      )
      .on("error", reject)
  );

  if (res.statusCode !== 200) {
    throw new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
  }

  const rawObj = await new Promise((resolve, reject) => {
    let rawData = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      rawData += chunk;
    });

    res.on("end", () => {
      try {
        resolve(JSON.parse(rawData));
      } catch (e) {
        reject(e);
      }
    });
  });

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

  await fs.promises.writeFile(
    path.resolve(__dirname, "../src/sampleData.json"),
    JSON.stringify(db),
    { flag: "w+" }
  );
})();
