// Tiago Ramada & Bernardo Vaz

"use strict";
import mysql from "mysql2/promise";
import connectionOptions from "./connection-options.js";



/**
 * Execute SQL Command
 * 
 * @param {string} command
 * @param {Array} parameters
 * @returns {Promise}
 */
async function execute(command, parameters = []) {
    let connection;
    try {
        connection = await mysql.createConnection(connectionOptions);
        let [result] = await connection.execute(command, parameters);
        return result;
        //result value is different depending on the SQL Command executed:
        //SELECT: [rows]
        //INSERT/UPDATE/DELETE: {affectedRows,changedRows,insertId,fieldCount,info,serverStatus,warningStatus}
    } catch (error) {
        return void 0;
    } finally {
        connection?.end();
    }
}



/**
 * Send Response
 * 
 * @param {Response} response
 * @param {string} command
 * @param {Array} parameters
 * @param {function} processResult
 */
async function sendResponse(response, command, parameters, processResult) {
    let result = await execute(command, parameters);
    
    if (result) {
        response.json(processResult(result));
    } else {
        sendError(response, "", 500);
    }
}



/**
 * Send Error
 * 
 * @param {Response} response
 * @param {string} error
 * @param {number} status
 */
function sendError(response, error = "", status = 400) {
    response.status(status).end(typeof error === "string" ? error : "");
}



/**
 * Number
 * 
 * @param {any} value
 * @returns {number}
 */
function number(value) {
    let result = Number(value);
    return isNaN(result) ? void 0 : result;
}



/**
 * String
 * 
 * @param {any} value
 * @returns {string}
 */
function string(value) {
    return value === undefined ? void 0 : String(value);
}



/**
 * Date
 * 
 * @param {any} value
 * @returns {string}
 */
function date(value) {
    if (typeof value !== "string") {
        return void 0;
    }
    if (!value.includes(" ")) {
        return value.replace("T", " ") + ":00";
    }
    return value;
}



/**
 * Valid NIF
 * 
 * @param {any} nif
 * @returns {string}
 */
function validNif(nif){
    let result = string(nif);
    if (!result || result.length !== 9) return '';
    return result;
}



export { execute, sendResponse, sendError, number, string, date, validNif };
