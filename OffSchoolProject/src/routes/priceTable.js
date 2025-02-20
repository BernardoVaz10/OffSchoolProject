// Tiago Ramada & Bernardo Vaz

"use strict";

import {
  sendResponse,
  sendError,
  number,
  string
} from "../scripts/utility-functions.js";



/**
 * Read Price Table
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readPriceTable(request, response) {
  const command = "SELECT * FROM Price_Table ORDER BY type ASC, price ASC";
  const parameters = [];
  try {
    await sendResponse(response, command, parameters, (result) => result);
  } catch (err) {
    sendError(response, "Failed to load price table", 500);
  }
}



/**
 * Create Price Table
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function createPriceTable(request, response) {
  let type = string(request.body.type);
  let subtype = string(request.body.subtype);
  let price = number(request.body.price);
  const command = "INSERT INTO Price_Table (type, subtype, price) VALUES (?, ?, ?)";
  const parameters = [type, subtype, price];
  try {
    await sendResponse(response, command, parameters, (result) => "Price added");
  } catch (err) {
    sendError(response, "Failed to add price table", 500);
  }
}



/**
 * Update Price Table
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updatePriceTable(request, response) {
  let id = number(request.params.id);
  let type = string(request.body.type);
  let subtype = string(request.body.subtype);
  let price = number(request.body.price);

  const command = "UPDATE Price_Table SET price = ?, type = ?, subtype = ? WHERE id = ?";
  const parameters = [price, type, subtype, id];
  try {
    await sendResponse(response, command, parameters, () => "Price updated");
  } catch (err) {
    sendError(response, "Failed to update price", 500);
  }
}



/**
 * Delete Price Table
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function deletePriceTable(request, response) {
  let id = number(request.params.id);
  const command = "DELETE FROM Price_Table WHERE id = ?";
  const parameters = [id];
  try {
    await sendResponse(response, command, parameters, (result) => "Price deleted");
  } catch (err) {
    sendError(response, "Failed to delete price", 500);
  }
}



export {
  readPriceTable,
  createPriceTable,
  updatePriceTable,
  deletePriceTable
};