// This file is to seperate the endpoint and the service logic.

//express-async-handler is responsible for handling all the exceptions. Thus we do not have to manually write try catch blocks
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const getContacts = asyncHandler(async (req, res) => {
  // Old - Without login validation
  // const contact = await Contact.find();

  //New - With login validation
  const contact = await Contact.find({ user_id: req.user.id });
  res.json(contact);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("No Contact found for the given id :: ", req.params.id);
  }
  res.json(contact);
});

const craeteContact = asyncHandler(async (req, res) => {
  console.log("Req data :: ", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    // If we throw this error like this then in the postman we will get to see
    // response in HTML format. Bit if we want to send any json response
    // then we have to craete custom middleware to handle it. (Check server.js)
    throw new Error("Mandatory fields are missing :: name, emal and phone");
  }
  const contact = await Contact.create({
    name: name,
    email: email,
    phone: phone,
    user_id: req.user.id,
  });
  res.json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }
  await Contact.deleteOne({ _id: req.params.id });

  res.status(200).json(contact);
});

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  updateContact,
  craeteContact,
};
