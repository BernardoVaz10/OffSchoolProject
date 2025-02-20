// Tiago Ramada & Bernardo Vaz

"use strict";

import {
  sendResponse,
  sendError,
  number
} from "../scripts/utility-functions.js";



/**
 * Read today's appointments
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readTodayAppointments(request, response) {
  let command = "SELECT * FROM Client_Description WHERE DATE(appointmentDate) = CURDATE() ORDER BY appointmentDate ASC";
  let parameters = [];
  try {
    await sendResponse(response, command, parameters, (result) => result);
  } catch (err) {
    sendError(response, "Failed to load today's appointments", 500);
  }
}



/**
 * Read tomorrow's appointments
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readTomorrowAppointments(request, response) {
  let command = `
    SELECT 
      cd.id,
      cd.idClient,
      cd.appointmentDate,
      cd.description,
      cd.technicalSheet,
      cd.paymentMethod,
      cd.price,
      cd.employee_id,
      c.name AS clientName
    FROM Client_Description cd
    JOIN Client c ON cd.idClient = c.id
    WHERE DATE(cd.appointmentDate) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    ORDER BY cd.appointmentDate ASC
  `;
  let parameters = [];
  try {
    await sendResponse(response, command, parameters, (result) => result);
  } catch (err) {
    sendError(response, "Failed to load tomorrow's appointments", 500);
  }
}



/**
 * Read appointments for a specific month
 * 
 * @param {Request} request
 * @param {Response} response
 */
async function readMonthAppointments(request, response) {
  const month = number(request.params.month);
  const command = `
    SELECT 
      c.name AS clientName,
      COUNT(cd.id) AS appointmentCount,
      COALESCE(SUM(cd.price), 0) AS totalProfit
    FROM Client_Description cd
    JOIN Client c ON cd.idClient = c.id
    WHERE MONTH(cd.appointmentDate) = ? 
      AND YEAR(cd.appointmentDate) = YEAR(CURDATE())
    GROUP BY c.name;
  `;
  if (month < 1 || month > 12) {
    return sendError(response, 'Mês inválido!', 400);
  }

  try {
    await sendResponse(response, command, [month], (result) => result);
  } catch (err) {
    sendError(response, 'Erro ao carregar dados financeiros do mês.', 500);
  }
}




export {
  readTodayAppointments,
  readTomorrowAppointments,
  readMonthAppointments
};