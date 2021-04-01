const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const uuid = require("uuid");

app.use(cors());
app.use(express.json());

app.get("/allnews", (req, res) => {
  fs.readFile(
    path.join(__dirname, "/data/allnews.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const parsedData = JSON.parse(data);

      console.log(parsedData.allnews[1]);
      if (req.query) {
        const filterBy = Object.keys(req.query);
        console.log(filterBy, req.query);
        filterBy.forEach((prop) => {
          const value = req.query[prop];

          if (prop === "selected") {
            parsedData.allnews = parsedData.allnews.filter(
              (item) => item.selected
            );
            return;
          }

          parsedData.allnews = parsedData.allnews.filter(
            (item) => item[prop] === value
          );
        });
      }

      res.send(parsedData);
    }
  );
});

app.put("/editnews", (req, res) => {
  fs.readFile(
    path.join(__dirname, "/data/allnews.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(422).end("Error while file reading");
        return;
      }

      const parsedData = JSON.parse(data);

      const index = parsedData.allnews.findIndex(
        (item) => item.id === req.body.id
      );

      parsedData.allnews[index] = { ...parsedData.allnews[index], ...req.body };

      fs.writeFile(
        path.join(__dirname, "/data/allnews.json"),
        JSON.stringify(parsedData),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            res.status(422).end("Error while file writing");
            return;
          }

          res.status(200).end();
        }
      );
    }
  );
});

app.post("/addnews", (req, res) => {
  fs.readFile(
    path.join(__dirname, "/data/allnews.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(422).end("Error while file reading");
        return;
      }

      const parsedData = JSON.parse(data);

      const itemToAdd = { ...req.body, id: uuid.v4() };

      parsedData.allnews.push(itemToAdd);

      fs.writeFile(
        path.join(__dirname, "/data/allnews.json"),
        JSON.stringify(parsedData),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            res.status(422).end("Error while file writing");
            return;
          }

          res.status(200).end();
        }
      );
    }
  );
});

app.delete("/deletenews/:id", (req, res) => {
  console.log(req.params);
  fs.readFile(
    path.join(__dirname, "/data/allnews.json"),
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(422).end("Error while file reading");
        return;
      }

      const parsedData = JSON.parse(data);

      parsedData.allnews = parsedData.allnews.filter(
        (item) => item.id !== req.params.id
      );

      fs.writeFile(
        path.join(__dirname, "/data/allnews.json"),
        JSON.stringify(parsedData),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            res.status(422).end("Error while file writing");
            return;
          }

          res.status(200).end();
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
