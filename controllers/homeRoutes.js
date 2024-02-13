const router = require('express').Router();
const User = require('../models/index');

router.get('/', async (req, res) => {
  // Send the rendered Handlebars.js template back as the response
  const data = await User.findAll({ raw: true });
  res.render('homepage', data);
});

module.exports = router;
