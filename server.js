const express = require("express");
const app = express();
const ejs = require("ejs");

const mongoose = require("mongoose");
const Item = require("./modules/collection.js");
const Order = require("./modules/order");

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
    let data = await Item.find({}, { __v: 0, _id: 0 });
    await res.send(data);
  } catch (e) {
    console.log(e);
  }
});

//Find category
app.get("/:category", async (req, res) => {
  let { category } = req.params;
  let data = await Item.find({ category }, { __v: 0, _id: 0 });
  try {
    await res.send(data);
  } catch (err) {
    console.log(err);
  }
});

//Find item
app.get("/item/:sku", async (req, res) => {
  let { sku } = req.params;
  let data = await Item.find({ sku }, { __v: 0, _id: 0 });
  try {
    await res.send(data);
  } catch (err) {
    console.log(err);
  }
});

//Deduct
app.post("/deduct", async (req, res) => {
  let { item, deduct } = req.body;
  try {
    let product = await Item.findOne({ item }, { __v: 0, _id: 0 });
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
    let sortRecommanded = await Item.find(
      { recommanded: true },
      { __v: 0, _id: 0 }
    );
    await res.send(sortRecommanded);
  } catch (e) {
    console.log(e);
  }
});

app.post("/addItem", async (req, res) => {
  let { sku, category, item, price, stock, photo, description, care, promo } =
    req.body;
  let newItem = new Item({
    sku,
    category,
    item,
    price,
    stock,
    photo,
    description,
    care,
    promo,
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

//Add Orders

app.post("/order/add", async (req, res) => {
  let { consignee, email, cellPhone, address, payment, note, items } = req.body;
  let newOrder = new Order({
    consignee: "地瓜",
    email: " digua@fake.com",
    cellPhone: "0912345678",
    address: "台北市大安區瑞安街3號",
    payment: "貨到付款",
    note,
    items: [
      { sku: "F2E00002", item: "粉紅佳人合果芋盆栽", qty: "2" },
      { sku: "F2E00001", item: "斑葉常春藤盆栽", qty: "3" },
      { sku: "F2E00003", item: "奧利多蔓綠絨盆栽", qty: "4" },
    ],
  });
  await newOrder
    .save()
    .then(() => {
      console.log(`New order accepted.`);
    })
    .catch((e) => {
      console.log(`New order not accepted.`);
      res.send(e);
    });
  if (newOrder) {
    for (let i = 0; i < newOrder.items.length; i++) {
      let filter = { sku: newOrder.items[i].sku };

      await Item.findOne(filter).then((stock) => {
        newStock = stock.stock - newOrder.items[i].qty;
      });

      let update = { stock: newStock };
      await Item.findOneAndUpdate(filter, update, {
        new: true,
      })
        .then((newStock) => {
          console.log(newStock);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    await res.send(
      `The new order and the stock has been created and well deducted. New order : 
        ${newOrder}`
    );
  } else res.send("Error");
});

//Find orders
app.get("/order/all", async (req, res) => {
  try {
    let data = await Order.find({}, { __v: 0 });
    await res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running...Go! Go! GO!")
);
