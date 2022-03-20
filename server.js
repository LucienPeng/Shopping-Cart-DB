const express = require("express");
const app = express();
const ejs = require("ejs");

const mongoose = require("mongoose");
const Item = require("./modules/collection.js");

const dotenv = require("dotenv");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("html", require("ejs").__express);
app.set("view engine", "html");
app.use(express.static(__dirname + "/views"));

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((e) => {
    console.log("Failed to connect to MongoDB");
    console.log(e);
  });

// CORS config here
app.all("/*", function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/cart", (req, res) => {
  res.render("cart.html");
});

app.get("/product", (req, res) => {
  res.render("product.html");
});

//Find All Data
app.get("/items", async (req, res) => {
  try {
    let data = await Item.find({});
    await res.send(data);
  } catch (e) {
    console.log(e);
  }
});

//Deduct
app.post("/deduct", async (req, res) => {
  let { item, deduct } = req.body;
  try {
    let product = await Item.findOne({ item });
    product.stock -= deduct;
    await product.save();
    await res.status(200).send(product);
  } catch (e) {
    console.log(e);
  }
});

//Sort
app.get("/recommanded", async (req, res) => {
  try {
    let sortRecommanded = await Item.find({ recommanded: true });
    await res.send(sortRecommanded);
  } catch (e) {
    console.log(e);
  }
});

app.post("/addItem", async (req, res) => {
  let { sku, category, item, price, stock, photo, description, recommanded } =
    req.body;
  let newItem = new Item({
    sku,
    category,
    item,
    price,
    stock,
    photo,
    description,
    recommanded,
  });
  await newItem
    .save()
    .then(() => {
      res.send(`Your item has been saved`);
      console.log(`item has been saved`);
    })
    .catch((e) => {
      console.log(`item is not accepted.`);
      console.log(e);
      res.send(e);
    });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...Go! Go! GO!")
);
