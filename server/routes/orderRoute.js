const router = require("express").Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.post("/checkout", auth, orderController.checkoutCart);
router.get("/my-orders", auth, orderController.getMyOrders);

module.exports = router;