const router = require('express').Router();
const productControl = require('../controllers/productControl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')
const upload = require('../middleware/upload');

router.route('/products')
.get(productControl.getProduct)
.post(auth,authAdmin,upload.single('images'),productControl.createProduct)

router.route('/products/:id')
.delete(auth,authAdmin,productControl.deleteProduct)
.put(auth,authAdmin,upload.single('images'),productControl.updateProduct)

router.route('/recommend/:productId')
.get(productControl.getRecommendations);

module.exports = router;