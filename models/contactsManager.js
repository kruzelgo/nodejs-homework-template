const fs = require("fs").promises;
const path = require("path");
const Joi = require("joi");

const contactsPath = path.join(__dirname, "../data/contacts.json");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to read contacts data");
  }
}

async function getById(id) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === id);
    return contact || null;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get contact with id ${id}`);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const { nanoid } = await import("nanoid");
    const contacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add new contact");
  }
}

async function removeContact(id) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
      return null;
    }
    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to remove contact with id ${id}`);
  }
}

async function updateContact(id, data) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
      return null;
    }
    contacts[index] = { ...contacts[index], ...data };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to update contact with id ${id}`);
  }
}

const listContactsManager = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve contacts" });
  }
};

const getContactByIdManager = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received ID for getContactByIdManager: ${id}`);
    const contact = await getById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to retrieve contact` });
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
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add new contact" });
  }
};

const removeContactManager = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received ID for removeContactManager: ${id}`);
    const result = await removeContact(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to delete contact ` });
  }
};

const updateContactManager = async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { id } = req.params;
    console.log(`Received ID for updateContactManager: ${id}`);
    const updatedContact = await updateContact(id, req.body);
    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: `Contact with id ${id} not found` });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Failed to update contact ` });
  }
};

module.exports = {
  listContactsManager,
  getContactByIdManager,
  addContactManager,
  removeContactManager,
  updateContactManager,
};
