const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrada');
const mockUser = require('../middlewares/mockUser');

router.post('/', mockUser, controller.create);
router.get('/', mockUser, controller.get);


module.exports = router;
