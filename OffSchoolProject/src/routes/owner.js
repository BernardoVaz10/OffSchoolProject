// Tiago Ramada & Bernardo Vaz

"use strict";

import {
    sendResponse,
    sendError,
    number,
    string,
    validNif
} from "../scripts/utility-functions.js";



/**
 * Read Owner
 *  
 * @param {Request} request
 * @param {Response} response
 */
async function readOwnerDetails(request, response) {
    let command = "SELECT * FROM Financial_Management";
    let parameters = [];
    await sendResponse(response, command, parameters, (result) => result);
}



/**
 * Update Owner Details
 *  
 * @param {Request} request
 * @param {Response} response
 */
async function updateOwnerDetails(request, response) {
    let id = number(request.params.id);
    let email = string(request.body.email);
    let address = string(request.body.address);
    let nif = validNif(request.body.nif);

    if (id && email && address && nif) {
        let command = "UPDATE Financial_Management SET email = ?, address = ?, nif = ? WHERE id = ?";
        let parameters = [email, address, nif, id];
        await sendResponse(response, command, parameters, (result) => result);
    } else {
        sendError(response, "Invalid data", 400);
    }
}



export {
    readOwnerDetails,
    updateOwnerDetails
};