const express = require('express')
const app = express()
const stripe = require("stripe")('sk_test_51HPbfHIIXgbKLxqKHqi70ZJIFV7QEJhBDyMJ9o4t0oltK7MOnpTyKNQBaDNXBOTZ5IwocnoPRiHE7NlwACWXm65g00w6UzeeBB');
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
  res.send('Hello World from our server haha')
})

app.post('/payment-sheet', jsonParser, async (req, res) => {
  let { charge, customer_id } = req.body
  console.log(charge, customer_id)
  
  // If there is customer_id in the request that means the user is not new so use the retrive method
  const customer = customer_id ? await stripe.customers.retrieve(customer_id) : await stripe.customers.create()
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: charge,
    currency: 'usd',
    customer: customer.id,
    payment_method_types: ['card'],
    capture_method: 'manual',
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  });
});

app.listen(3000)



