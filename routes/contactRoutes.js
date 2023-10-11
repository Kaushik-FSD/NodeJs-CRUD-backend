const express = require("express");
const router = express.Router();
const {
  getContact,
  getContacts,
  deleteContact,
  updateContact,
  craeteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

//Since our contact routes are private (Only loggedin user will be able to access it)
//So we are passing a middleware to check if the loggedin user only can access this.
router.use(validateToken);

router.route("/").get(getContacts);

router.route("/:id").get(getContact);

router.route("/").post(craeteContact);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

/*
we can simplify the routes by writing it in this way.

router.route("/").get(getContacts).post(craeteContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
*/

module.exports = router;
