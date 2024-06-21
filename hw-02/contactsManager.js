const contactsService = require("./contactsService");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const listContacts = async () => {
  const contacts = await contactsService.listContacts();
  return contacts;
};

const getById = async (id) => {
  const contact = await contactsService.getById(id);
  return contact;
};

const addContact = async (body) => {
  const { error } = contactSchema.validate(body);
  if (error) {
    throw new Error(`missing required ${error.details[0].context.key} field`);
  }
  const newContact = await contactsService.addContact(body);
  return newContact;
};

const removeContact = async (id) => {
  const result = await contactsService.removeContact(id);
  return result;
};

const updateContact = async (id, body) => {
  const { error } = contactSchema.validate(body);
  if (error) {
    throw new Error(`missing required ${error.details[0].context.key} field`);
  }
  const updatedContact = await contactsService.updateContact(id, body);
  return updatedContact;
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
