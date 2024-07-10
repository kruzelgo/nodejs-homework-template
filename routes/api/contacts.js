const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/contactController");
const auth = require("../../middlewares/auth");

router.get("/", auth, contactController.getAllContacts);
router.get("/:id", auth, contactController.getContactById);
router.post("/", auth, contactController.addContact);
router.delete("/:id", auth, contactController.deleteContact);
router.put("/:id", auth, contactController.updateContact);
router.patch("/:id/favorite", auth, contactController.toggleFavorite);

module.exports = router;
