// Tiago Ramada & Bernardo Vaz

"use strict";

import {
    sendResponse,
    sendError,
    number,
    string
} from "../scripts/utility-functions.js";



/**
 * Read Employees
 *  
 * @param {Request} request
 * @param {Response} response
 */
async function readEmployees(request, response) {
    let command = "SELECT * FROM Employee";
    let parameters = [];
    await sendResponse(response, command, parameters, (result) => result);
}



/**
 * Read Employees By Id
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readEmployeesById(request, response) {
    let id = number(request.params.id);
    let command = "SELECT * FROM Employee WHERE `id` = ?";
    if (id) {
        await sendResponse(response, command, [id], (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Create Employees
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function createEmployees(request, response) {
    let name = string(request.body.name);

    if (name) {
        let command = "INSERT INTO Employee (name) VALUES (?)";
        let parameters = [name];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Update Employees
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function updateEmployees(request, response) {
    let id = number(request.params.id);
    let name = string(request.body.name);

    if (id && name) {
        let command = "UPDATE Employee SET name = ? WHERE id = ?";
        let parameters = [name, id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



/**
 * Delete Employees
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function deleteEmployees(request, response) {
    let id = number(request.params.id);
    let command = "DELETE FROM Employee WHERE id = ?";
    if (id) {
        await sendResponse(response, command, [id], (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



export {
    readEmployees,
    readEmployeesById,
    createEmployees,
    updateEmployees,
    deleteEmployees
};