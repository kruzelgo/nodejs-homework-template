const express = require("express");
const router = express.Router();
const { Contact, validateContact } = require("../../models/contactsModel");

const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
};

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = validateContact(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    handleErrors(res, error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = validateContact(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    handleErrors(res, error);
  }
});

router.patch("/:id/favorite", async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = router;
