const mongoose = require("mongoose");
//var AutoIncrement = require("mongoose-sequence")(mongoose);

const itemSchema = new mongoose.Schema({
  sku: {
    type: Number,
  },
  category: {
    type: String,
  },
  item: {
    type: String,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  photo: {
    type: String,
  },
  description: {
    type: String,
  },
  recommanded: {
    type: Boolean,
    default: false,
  },
});

//messageSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "id" });
const Item = mongoose.model("item", itemSchema);

module.exports = Item;
