const express = require("express");
const router = express.Router();
const contactsManager = require("../../models/contactsManager");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsManager.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsManager.getContactById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newContact = await contactsManager.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    if (error.message.includes("Validation error")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to add new contact" });
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsManager.removeContact(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await contactsManager.updateContact(id, req.body);
    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    if (error.message.includes("Validation error")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to update contact" });
    }
  }
});

module.exports = router;
