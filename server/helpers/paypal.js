const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AW45qXwoGObVyp9fqIb5QaIIIP5n5sbM3kWPNHSc5yIloM3HpmAmyc6OyGRpggVRPiiPTMgpdW_6zoM7",
  client_secret: "EPu8wWyu2vQ_QZLTvWZNN5ow7Mmx9I7O5acgqym09EOYFeARkWSSwlvgEqpV6yWJKzspwDtrfWZ3f65i",
});

module.exports = paypal;