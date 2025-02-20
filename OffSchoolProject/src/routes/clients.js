// Tiago Ramada & Bernardo Vaz

"use strict";

import {
    sendResponse,
    sendError,
    number,
    string,
    date,
    validNif
} from "../scripts/utility-functions.js";



/**
 * Read Clients
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readClients(request, response) {
    let command = "SELECT * FROM Client";
    let parameters = [];
    await sendResponse(response, command, parameters, (result) => result);
}



/**
 * Read Clients By Id
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readClientsById(request, response) {
    let id = number(request.params.id);
    let command = "SELECT * FROM Client WHERE `id` = ?";
    if (id) {
        await sendResponse(response, command, [id], (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Create Clients
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function createClients(request, response) {
    let name = string(request.body.name);
    let age = number(request.body.age);
    let email = string(request.body.email);
    let address = string(request.body.address);
    let nif = validNif(request.body.nif);

    if (name && age && email && address && nif.length === 9) {
        let command = "INSERT INTO Client (name, age, email, address, nif) VALUES (?, ?, ?, ?, ?)";
        let parameters = [name, age, email, address, nif];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Update Clients
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updateClients(request, response) {
    let id = number(request.params.id);
    let name = string(request.body.name);
    let age = number(request.body.age);
    let email = string(request.body.email);
    let address = string(request.body.address);
    let nif = string(request.body.nif);

    if (id && name && age && email && address && nif.length === 9) {
        let command = "UPDATE Client SET name = ?, age = ?, email = ?, address = ?, nif = ? WHERE id = ?";
        let parameters = [name, age, email, address, nif, id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Delete Clients
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function deleteClients(request, response) {
    let id = number(request.params.id);

    if (id) {
        let command = "DELETE FROM Client WHERE id = ?";
        let parameters = [id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}





/**
 * Read Clients Description
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readClientsDescription(request, response) {
    let id = number(request.params.id);
    let command = "SELECT * FROM Client_Description WHERE `idClient` = ?";
    if (id) {
        await sendResponse(response, command, [id], (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Update Client Payment Method
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updateClientPaymentMethod(request, response) {
    let id = number(request.params.id);
    let paymentMethod = string(request.body.paymentMethod);

    if (id && paymentMethod) {
        let command = "UPDATE Client_Description SET paymentMethod = ? WHERE id = ?";
        let parameters = [paymentMethod, id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Update Client Description
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updateClientDescription(request, response) {
    let id = number(request.params.id);
    let appointmentId = number(request.body.appointmentId);
    let description = string(request.body.description);
    let dateReceived = date(request.body.appointmentDate);
    let price = number(request.body.price);
    let employee_id = number(request.body.employee_id);
    let technicalSheet = string(request.body.technicalSheet);

    if (id && appointmentId && description && dateReceived && price && employee_id) {
        let command = "UPDATE Client_Description SET appointmentDate = ?, description = ?, technicalSheet = ?, price = ?, employee_id = ? WHERE idClient = ? AND id = ?";
        let parameters = [dateReceived, description, technicalSheet, price, employee_id, id, appointmentId];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Create Client Description
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function createClientDescription(request, response) {
    let id = number(request.params.id);
    let description = string(request.body.description);
    let dateReceived = date(request.body.appointmentDate);
    let price = number(request.body.price);
    let employee_id = number(request.body.employee_id);
    let technicalSheet = string(request.body.technicalSheet);

    if (id && description && dateReceived && (price !== undefined  && price !== null) && employee_id) {
        let command = "INSERT INTO Client_Description (idClient, appointmentDate, description, technicalSheet, price, employee_id) VALUES (?, ?, ?, ?, ?, ?)";
        let parameters = [id, dateReceived, description, technicalSheet, price, employee_id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Delete Client Description
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function deleteClientDescription(request, response) {
    let id = number(request.params.id);
    let appointmentId = number(request.body.appointmentId);

    if (id && appointmentId) {
        let command = "DELETE FROM Client_Description WHERE idClient = ? AND id = ?";
        let parameters = [id, appointmentId];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



export {
    readClients,
    readClientsById,
    createClients,
    updateClients,
    deleteClients,
    readClientsDescription,
    updateClientPaymentMethod,
    updateClientDescription,
    createClientDescription,
    deleteClientDescription
};