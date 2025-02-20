"use strict";

/**
 * @function fetchJson
 *
 * @param {string} url
 * @param {string} method
 * @param {object} body
 * 
 * @returns {object} response
 *   
 * @description Function to fetch the data from the server
 */
async function fetchJson(url, method = "GET", body) {
  let options = {
    method: method,
    headers: {
      "Accept": "application/json"
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }
  try {
    let response = await fetch(url, options);
    return response.ok ? await response.json() : void 0;
  } catch (err) {
    return void 0;
  }
}

/**
 * @function createElementGeneric
 *  
 * @param {string} tag
 * @param {string} className
 * @param {string} textContent
 *  
 * @description Function to create a generic element
 * 
 * @returns {element} element
 * 
 */
var createElementGeneric = function (tag, className, textContent) {
    var element = document.createElement(tag);
    element.classList.add(className);
    element.id = className;
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  }
  
  /**
   * @function createLabeledInput
   *  
   * @param {string} labelText
   * @param {element} inputElement
   *  
   * @description Function to create a labeled input
   * 
   * @returns {element} container
   * 
   */
  var createLabeledInput = function (labelText, inputElement) {
    var container = createElementGeneric('div', 'inputContainer');
    var label = createElementGeneric('label', 'test', labelText);
    container.appendChild(label);
    container.appendChild(inputElement);
    return container;
  }
  
  /**
   * @function selectRow
   * 
   * @description Function to show the selected row
   * 
   */
  var selectRow = function (event) {
    var clickedRow = event.currentTarget;
    var clickedIndex = clickedRow.getAttribute('index');
  
    var deleteButton = document.querySelector('.deleteButton');
    var detailsButton = document.querySelector('.detailsButton');
  
    var removeAppointmentButton = document.querySelector('.removeAppointment');
    var editAppointmentButton = document.querySelector('.editAppointment');
  
    var deleteEmployeeButton = document.querySelector('.deleteEmployeeButton');
  
    var editPriceTableButton = document.querySelector('.editPriceTableButton');
    var deletePriceTableButton = document.querySelector('.deletePriceTableButton');

    var editStockButton = document.querySelector('.editStockButton');
    var deleteStockButton = document.querySelector('.deleteStockButton');
  
  
    if (selectedRow === clickedIndex && clickedRow.classList.contains('selected')) {
      clickedRow.classList.remove('selected');
      if (deleteButton && detailsButton) {
        deleteButton.disabled = true;
        detailsButton.disabled = true;
      }
      if (removeAppointmentButton && editAppointmentButton) {
        removeAppointmentButton.disabled = true;
        editAppointmentButton.disabled = true;
      }
      if (deleteEmployeeButton) {
        deleteEmployeeButton.disabled = true;
      }
      if (editPriceTableButton && deletePriceTableButton) {
        editPriceTableButton.disabled = true;
        deletePriceTableButton.disabled = true;
      }

      if (editStockButton && deleteStockButton) {
        editStockButton.disabled = true;
        deleteStockButton.disabled = true;
      }

      selectedRow = null;
    } else {
      if (selectedRow !== null) {
        var trs = document.documentElement.getElementsByTagName('tr');
        for (var i = 0; i < trs.length; i++) {
          trs[i].classList.remove('selected');
        }
      }
      clickedRow.classList.add('selected');
      if (deleteButton && detailsButton) {
        deleteButton.disabled = false;
        detailsButton.disabled = false;
      }
      if (removeAppointmentButton && editAppointmentButton) {
        removeAppointmentButton.disabled = false;
        editAppointmentButton.disabled = false;
      }
      if (deleteEmployeeButton) {
        deleteEmployeeButton.disabled = false;
      }
      if (editPriceTableButton && deletePriceTableButton) {
        editPriceTableButton.disabled = false;
        deletePriceTableButton.disabled = false;
      }
      if (editStockButton && deleteStockButton) {
        editStockButton.disabled = false;
        deleteStockButton.disabled = false;
      }
      selectedRow = clickedIndex;
    }
  }
  
  /**
   * @function checkForm
   * 
   * @description Function to check if exists a form
   */
  var checkForm = function () {
    var form = document.documentElement.getElementsByTagName('form')[0];
    if (form) {
      form.remove();
    }
  }
  
  /**
   * @function clearTableFromScreen
   * 
   * @description Function to clear the table from the screen
   */
  var clearTableFromScreen = function () {
    var main = document.documentElement.getElementsByTagName('main')[0];
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
  }
  
  /**
   * 
   * @function checkDataForm
   * 
   * @param {name}
   * @param {age}
   * @param {email}
   * @param {address}
   * @param {nif}
   * 
   * @description Function to check if the data is correct
   */
  var checkDataForm = function (name, age, email, address, nif) {
    if (!name || !age) {
      alert('Preencha os campos Nome e o Telefone');
      return false;
    } else if (!/^[\p{L}]+$/u.test(name.replace(/\s/g, ''))) {
      alert('Nome inválido');
      return false;
    } else if (age < 0) {
      alert('Telefone inválido');
      return false;
    }
    return true;
  }
  
  /**
   * 
   * @function checkFinancialData
   * 
   * @param {email}
   * @param {address}
   * @param {nif}
   * 
   * @description Function to check if the data is correct
   */
  var checkFinancialData = function (email, address, nif) {
    if (!email || !address || !nif) {
      alert('Preencha todos os campos');
      return false;
    } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      alert('Email inválido');
      return false;
    } else if (nif.length !== 9) {
      return false;
    }
    return true;
  }