// Tiago Ramada & Bernardo Vaz

"use strict";
import express from "express";
import * as clients from "./routes/clients.js";
import * as employees from "./routes/employees.js";
import * as owner from "./routes/owner.js";
import * as priceTable from "./routes/priceTable.js";
import * as appointments from "./routes/appointments.js";
import * as stocks from "./routes/stocks.js";

const app = express();

app.use(express.static("www", {
    "index": "index.html"
}));
app.use(express.json());

// Clients
app.get("/clients/:id", clients.readClientsById);
app.get("/clients", clients.readClients);
app.post("/clients", clients.createClients);
app.put("/clients/:id", clients.updateClients);
app.delete("/clients/:id", clients.deleteClients);

// Clients Description
app.get("/clients/:id/description", clients.readClientsDescription);
app.put("/clients/:id/description", clients.updateClientDescription);
app.post("/clients/:id/description", clients.createClientDescription);
app.delete("/clients/:id/description", clients.deleteClientDescription);
app.put("/clients/:id/paymentMethod", clients.updateClientPaymentMethod);

// Employees
app.get("/employees", employees.readEmployees);
app.get("/employees/:id", employees.readEmployeesById);
app.post("/employees", employees.createEmployees);
app.put("/employees/:id", employees.updateEmployees);
app.delete("/employees/:id", employees.deleteEmployees);

// Owner
app.get("/owner", owner.readOwnerDetails);
app.put("/owner/:id", owner.updateOwnerDetails);

// Price Table
app.get("/price_table", priceTable.readPriceTable);
app.post("/price_table", priceTable.createPriceTable);
app.put("/price_table/:id", priceTable.updatePriceTable);
app.delete("/price_table/:id", priceTable.deletePriceTable);

// Appointments
app.get("/appointments/today", appointments.readTodayAppointments);
app.get("/appointments/tomorrow", appointments.readTomorrowAppointments);
app.get("/appointments/month/:month", appointments.readMonthAppointments);

// Stocks
app.get("/stocks", stocks.readStocks);
app.put("/stocks/:id", stocks.updateStocks);
app.post("/stocks", stocks.createStocks);
app.delete("/stocks/:id", stocks.deleteStocks);

// Start the server on port 8081
app.listen(8081, () => {
    console.log("Server started at http://localhost:8081");
});
