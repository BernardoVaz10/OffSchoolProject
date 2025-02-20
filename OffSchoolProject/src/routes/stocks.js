// Tiago Ramada & Bernardo Vaz

"use strict";

import {
    sendResponse,
    sendError,
    number,
    string
} from "../scripts/utility-functions.js";

/**
 * Read Stocks
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readStocks(request, response) {
    let command = "SELECT * FROM Stocks";
    let parameters = [];
    await sendResponse(response, command, parameters, (result) => result);
}

/**
 * Update Stocks
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updateStocks(request, response) {
    let id = number(request.params.id);
    let name = string(request.body.name);
    let quantity = number(request.body.quantity);
    let reference = string(request.body.reference);

    if (id && (name || quantity || reference)) {
        let command = "UPDATE Stocks SET ";
        let parameters = [];
        if (name) {
            command += "name = ?, ";
            parameters.push(name);
        }
        if (quantity) {
            command += "quantity = ?, ";
            parameters.push(quantity);
        }
        if (reference) {
            command += "reference = ?, ";
            parameters.push(reference);
        }
        command = command.slice(0, -2) + " WHERE id = ?";
        parameters.push(id);
        await sendResponse(response, command, parameters, (result) => result);
    }
}

/**
 * Create Stocks
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function createStocks(request, response) {
    let name = string(request.body.name);
    let quantity = number(request.body.quantity);
    let reference = string(request.body.reference);

    if (name && quantity && reference) {
        let command = "INSERT INTO Stocks (name, quantity, reference) VALUES (?, ?, ?)";
        let parameters = [name, quantity, reference];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}

/**
 * Delete Stocks
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function deleteStocks(request, response) {
    let id = number(request.params.id);

    if (id) {
        let command = "DELETE FROM Stocks WHERE id = ?";
        let parameters = [id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}

export {
    readStocks,
    updateStocks,
    createStocks,
    deleteStocks
};