const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    consignee: {
      type: String,
    },
    email: {
      type: String,
    },
    cellPhone: {
      type: String,
    },
    address: {
      type: String,
    },
    payment: {
      type: String,
    },
    note: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
    },
  },
  { versionKey: false }
);

orderSchema.plugin(AutoIncrement, {
  id: "order_seq",
  inc_field: "orderNumber",
});
const Order = mongoose.model("order", orderSchema);

module.exports = Order;
