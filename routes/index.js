const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const router = express.Router();

// const stripe = require('stripe')('');

const partialsDir = path.join(__dirname, '../views/partials');
fs.readdirSync(partialsDir).forEach(filename => {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8');
  hbs.registerPartial(name, template);
});

router.get('/', (req, res, next) => {
  res.render('index', { heading: 'jordendraws' });
});

router.get('/portfolio', (req, res, next) => {
  res.render('portfolio', { heading: 'portfolio' });
});
router.get('/portfolio/dragons', (req, res, next) => {
  res.render('portfolio-category', { 
    heading: 'dragons',
    items: [
      {
        source: '/images/dragon_nature.png',
        title: 'Nature Dragon',
      },
      {
        source: '/images/dragon_nature_2.png',
        title: 'Nature Dragon',
      },
      {
        source: '/images/dragon_nature_winged.png',
        title: 'Nature Dragon',
      },
      {
        source: '/images/dragon_paradise.png',
        title: 'Nature Dragon',
      }
    ]
  });
});
router.get('/portfolio/hawaii', (req, res, next) => {
  res.render('portfolio-category', { 
    heading: 'hawaii',
    items: []
  });
});
router.get('/portfolio/characters', (req, res, next) => {
  res.render('portfolio-category', { 
    heading: 'hawaii',
    items: []
  });
});
router.get('/portfolio/traditional-art', (req, res, next) => {
  res.render('portfolio-category', { 
    heading: 'traditional art',
    items: []
  });
});

router.get('/about', (req, res, next) => {
  res.render('about', { heading: 'about' });
});

router.get('/shop', (req, res, next) => {
  res.render('shop', { heading: 'shop' });
});

router.get('/retail-locations', (req, res, next) => {
  res.render('retail-locations', { heading: 'retail-locations' });
});

router.get('/commissions', (req, res, next) => {
  res.render('commissions', { heading: 'commissions' });
});

router.get('/events', (req, res, next) => {
  res.render('events', { heading: 'events' });
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
