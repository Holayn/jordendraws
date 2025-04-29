const express = require('express');
const router = express.Router();
// const stripe = require('stripe')('');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      success_url: `https://jordendraws.com/checkout-success?session=${session.id}`,
      cancel_url: `https://jordendraws.com/checkout-cancel?session=${session.id}`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/checkout-success/:session', async (req, res) => {
  if (!req.params.session) {
    res.status(400).json({ error: 'No session provided' });
  }

  const sessionId = req.params.session;
  const items = await stripe.checkout.sessions.listLineItems(sessionId);
  res.status(200).json(items.data);
});

module.exports = router;
