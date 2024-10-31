const express = require('express');

const router = express.Router();
const usercontroller = require('../controllers/usersController')

router.get('/', usercontroller.getUsers)
router.post('/login', usercontroller.login)
router.post('/register', usercontroller.register)



module.exports = router;