const express = require("express");
const router = express.Router();
const contactsManager = require("../../models/contactsManager");

router.get("/", contactsManager.listContactsManager);

router.get("/:id", contactsManager.getContactByIdManager);

router.post("/", contactsManager.addContactManager);

router.delete("/:id", contactsManager.removeContactManager);

router.put("/:id", contactsManager.updateContactManager);

module.exports = router;
