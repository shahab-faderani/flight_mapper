const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const uuid = require("uuid");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//flight plans, stored with their necessary attributes.
let plans = [];

app.get("/plans", (req, res) => {
  res.send(plans);
});

app.post("/plans", (req, res) => {
  if (req.body) {
    let plan = req.body;
    plan.uuid = uuid.v4();
    plans.push(plans);
    res.json(plans);
  } else {
    res.sendStatus(400)
  }
});

app.delete("/plans/:id", (req, res) => {
  plans = plans.filter(({ uuid }) => uuid !== req.params.id);
  res.json(plans);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
