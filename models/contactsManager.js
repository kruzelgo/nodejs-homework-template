const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
    console.error(error);
    throw new Error("Failed to read contacts data");
  }
}

async function getContactById(id) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === id);
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get contact with id ${id}`);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const { error } = contactSchema.validate({ name, email, phone });
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const contacts = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add new contact");
  }
}

async function removeContact(id) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      return null;
    }
    const removedContact = contacts.splice(index, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to remove contact with id ${id}`);
  }
}

async function updateContact(id, { name, email, phone }) {
  try {
    const { error } = contactSchema.validate({ name, email, phone });
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      return null;
    }
    contacts[index] = { ...contacts[index], name, email, phone };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update contact with id ${id}`);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
