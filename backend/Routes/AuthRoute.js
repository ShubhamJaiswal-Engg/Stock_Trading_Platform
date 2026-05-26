const { Signup ,Login, UserData, Me, Logout} = require("../controllers/AuthController");
const { Holdings, Positions, Orders,NewOrder } = require("../controllers/AuthController");
const{ sendResetOtp, resetPassword, verifyOtp  } = require('../controllers/smtpController')
const router = require("express").Router();
const { requireAuth } = require("../middleware/requireAuth");
const { optionalAuth } = require("../middleware/optionalAuth");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", optionalAuth, Me);

router.get("/allHoldings", requireAuth, Holdings);
router.get("/allPositions", requireAuth, Positions);
router.get("/allOrders", requireAuth, Orders);
router.post("/newOrder", requireAuth, NewOrder);
router.post("/forget-password",sendResetOtp)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password", resetPassword)
router.get("/api/user/:id", requireAuth, UserData);

module.exports = router;

