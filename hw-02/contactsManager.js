const contactsService = require("./contactsService");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const listContactsManager = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

const getContactByIdManager = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: `Failed to retrieve contact with id ${id}` });
  }
};

const addContactManager = async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: `Missing required ${error.details[0].context.key} field`,
    });
  }

  try {
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add new contact" });
  }
};

const removeContactManager = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to delete contact with id ${id}` });
  }
};

const updateContactManager = async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { id } = req.params;
    const updatedContact = await contactsService.updateContact(id, req.body);
    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to update contact with id ${id}` });
  }
};

module.exports = {
  listContactsManager,
  getContactByIdManager,
  addContactManager,
  removeContactManager,
  updateContactManager,
};
