const mongoose = require("mongoose");
//var AutoIncrement = require("mongoose-sequence")(mongoose);

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 300,
  },
});

//messageSchema.plugin(AutoIncrement, { id: "order_seq", inc_field: "id" });
const Item = mongoose.model("item", itemSchema);

module.exports = Item;
