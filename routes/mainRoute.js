const express = require('express');

const {
   test 

} = require('../controllers/mainController')



// const multer = require('multer');
// const path = require('path');

const router = express.Router();

router.route('/test').get(test);


module.exports = router;