const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "./data/contacts.json");

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

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
