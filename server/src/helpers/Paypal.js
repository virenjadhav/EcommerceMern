// const paypal = require("@paypal/checkout-server-sdk");
// require("dotenv").config();

// function environment() {
//   const clientId = process.env.paypalClientId;
//   const clientSecret = process.env.paypalClientSecret;

//   if (process.env.NODE_ENV == "Production") {
//     return new paypal.core.LiveEnvironment(clientId, clientSecret);
//   }
//   return new paypal.core.SandboxEnvironment(clientId, clientSecret);
// }
// function client() {
//   return new paypal.core.PayPalHttpClient(environment());
// }
// module.exports = { client, paypal };

// const paypal = require("paypal-rest-sdk");
// require("dotenv").config();
// const clientId = process.env.paypalClientId;
// const clientSecret = process.env.paypalClientSecret;

// paypal.configure({
//   mode: "sandbox",
//   client_id: clientId,
//   client_secret: clientSecret,
// });

// module.exports = paypal;

const paypal = require("@paypal/checkout-server-sdk");
require("dotenv").config();
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client, paypal };
