const express = require('express');
const router = express.Router();
const {createUser, signin} = require("./userController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/create-user", createUser)

router.post('/sign-in', signin)

module.exports = router;
