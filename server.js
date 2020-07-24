const express = require("express");
const app = express();
const port = 3000;
const request = require("request");

app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/", (req, res) => res.send("Welcome"));
app.get("/all", (req, res) => res.send("Not implemented"));
app.get("/:code/:language", (req, res) => {
  cityCode = req.params.code;
  language = req.params.language;
  getDataFromWiKidata(cityCode.toUpperCase(), language, res);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

function getDataFromWiKidata(cityCode, language, resp) {
  url =
    "https://www.wikidata.org/wiki/Special:EntityData/" + cityCode + ".json";
  request(url, { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    resp.send(removeRequestedData(body, cityCode, language));
  });
}

function removeRequestedData(data, code, language) {
  var response = {};
  response.code = code;
  response.labels = data.entities[code].labels[language].value;
  response.descriptions = data.entities[code].descriptions[language].value;
  response.aliases = getItems(data.entities[code].aliases[language]);
  return response;
}

function getItems(arrayItems) {
  listItem = [];
  arrayItems.forEach((i) => {
    listItem.push(i.value);
  });
  return listItem;
}
