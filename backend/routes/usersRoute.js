const express = require('express');
const router = express.Router();
const users=require('../controllers/user');


router.route('/register').post(users.registerUser)
router.post('/login', users.login)

module.exports = router;