const Contact = require("../models/contactsModel");

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ _id: id, owner: req.user._id });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contact" });
  }
};

exports.addContact = async (req, res) => {
  try {
    const newContact = new Contact({ ...req.body, owner: req.user._id });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add new contact" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update contact" });
  }
};
