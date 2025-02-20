"use strict";

/**
 * Class Owner
 * 
 * @param {string} email
 * @param {string} address
 * @param {string} nif
 * 
 */
class Owner {
    constructor(email, address, nif) {
        this.email = email;
        this.address = address;
        this.nif = nif;
    }

    getEmail() {
        return this.email;
    }

    getAddress() {
        return this.address;
    }

    getNif() {
        return this.nif;
    }
}

/**
* Get Owner from the database
*
*/
Owner.getOwner = async function () {
    const result = await fetchJson(`/owner`, 'GET');
    if (!result) throw new Error('Failed to load Owner');
    owner = new Owner(result[0].email, result[0].address, result[0].nif);
};

/**
 * Update Owner from the database
 * 
 * @param {string} email
 * @param {string} address
 * @param {string} nif
 * 
 */
Owner.updateOwner = async function (email, address, nif) {
    const result = await fetchJson(`/owner/1`, 'PUT', {
        email,
        address,
        nif
    });
    if (!result) throw new Error('Failed to update Owner');
    owner = new Owner(email, address, nif);
}

/**
 * @function createFinancialDetails
 * 
 * @description Function to create/show the financial details, his email, nif and address, and have a button to edit the details
 * 
 */
var createFinancialDetails = async function () {
    await Owner.getOwner();
    var div = createElementGeneric('div', 'financialDiv');
    var h2 = createElementGeneric('h2', 'financialTitle', 'Os Seus Detalhes Financeiros');
    div.appendChild(h2);
    var p = createElementGeneric('p', 'financialEmail', 'Email: ' + owner.email);
    div.appendChild(p);
    p = createElementGeneric('p', 'financialAddress', 'Endereço de Morada: ' + owner.address);
    div.appendChild(p);
    p = createElementGeneric('p', 'financialNif', 'NIF: ' + owner.nif);
    div.appendChild(p);
  
    var divButtons = createElementGeneric('div', 'financialButtons');
    var editarDados = createElementGeneric('button', 'editFinancialButton', 'Editar Dados');
    var mostrarDados = createElementGeneric('button', 'showFinancialButton', 'Obter Extrato Mensal');
  
    divButtons.appendChild(editarDados);
    divButtons.appendChild(mostrarDados);
  
    editarDados.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      editFinancialDetails();
    });
  
    mostrarDados.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      showMonthlyForm();
    });
    div.appendChild(divButtons);
    return div;
  }
  
  /**
   * @function editFinancialDetails
   *  
   * @description Function to edit the financial details
   *  
   */
  var editFinancialDetails = function () {
    var div = createElementGeneric('div', 'editFinancialDiv');
    var h2 = createElementGeneric('h2', 'editFinancialTitle', 'Editar Dados Financeiros');
    div.appendChild(h2);
  
    var emailInput = createElementGeneric('input', 'editFinancialEmail');
    emailInput.value = owner.getEmail();
    div.appendChild(createLabeledInput('Email:', emailInput));
  
    var addressInput = createElementGeneric('input', 'editFinancialAddress');
    addressInput.value = owner.getAddress();
    div.appendChild(createLabeledInput('Endereço de Morada:', addressInput));
  
    var nifInput = createElementGeneric('input', 'editFinancialNif');
    nifInput.value = owner.getNif();
    div.appendChild(createLabeledInput('NIF:', nifInput));
  
    var divButtons = createElementGeneric('div', 'editFinancialButtons');
    var saveButton = createElementGeneric('button', 'saveFinancialButton', 'Guardar');
    var cancelButton = createElementGeneric('button', 'cancelFinancialButton', 'Cancelar');
  
    saveButton.addEventListener('click', async function () {
      if (!checkFinancialData(emailInput.value, addressInput.value, nifInput.value)) {
        return;
      };
      await fetchJson(`/owner/1`, 'PUT', {
        email: emailInput.value,
        address: addressInput.value,
        nif: nifInput.value
      });
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createFinancialDetails());
    });
  
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createFinancialDetails());
    });
    divButtons.appendChild(saveButton);
    divButtons.appendChild(cancelButton);
    div.appendChild(divButtons);
    document.documentElement.getElementsByTagName('main')[0].appendChild(div);
  }
  
  /**
   * @function showMonthlyForm
   *
   * @description Function to show the form to select the month to show the financial data
   *   
   * @returns {element} formDiv
   *   
   * */
  var showMonthlyForm = function () {
    var formDiv = createElementGeneric('div', 'financialFormDiv');
    var labelMonth = createElementGeneric('label', 'monthSelectLabel', 'Escolha o Mês: ');
    var monthSelect = createElementGeneric('select', 'monthSelect');
    var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
    months.forEach((month, index) => {
      var option = document.createElement('option');
      option.value = index + 1;
      option.textContent = month;
      monthSelect.appendChild(option);
    });
  
    formDiv.appendChild(labelMonth);
    formDiv.appendChild(monthSelect);
  
    var buttonsDiv = createElementGeneric('div', 'financialButtons');
    var cancelButton = createElementGeneric('button', 'cancelButton', 'Cancelar');
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createFinancialDetails());
    });
  
    var confirmButton = createElementGeneric('button', 'confirmButton', 'Confirmar');
    confirmButton.addEventListener('click', async function () {
      var selectedMonth = monthSelect.value;
      checkForm()
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await showMonthlyFinancialData(selectedMonth));
    });
    buttonsDiv.appendChild(cancelButton);
    buttonsDiv.appendChild(confirmButton);
    formDiv.appendChild(buttonsDiv);
    document.documentElement.getElementsByTagName('main')[0].appendChild(formDiv);
  }
  
  /**
   * @function showMonthlyFinancialData
   * 
   * @param {number} month
   * 
   * @description Function to show the financial data of the selected month
   * 
   * @returns {element} tableDiv
   */
  var showMonthlyFinancialData = async function (month) {
    const appointmentsData = await fetchJson(`/appointments/month/${month}`);
  
    var tableDiv = createElementGeneric('div', 'monthlyFinancialDiv');
  
    const totalProfit = appointmentsData.reduce((sum, appointment) => sum + (appointment.totalProfit || 0), 0);
    var profitLabel = createElementGeneric('h3', 'profitLabel', `Lucro Total: ${totalProfit.toFixed(2)}€`);
    tableDiv.appendChild(profitLabel);
  
    var table = createElementGeneric('table', 'monthlyFinancialTable');
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
  
    const headers = ['Cliente', 'Número de Marcações Efetuadas'];
    headers.forEach(header => {
      var th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    var tbody = createElementGeneric('tbody', 'monthlyFinancialTableBody');
  
    if (!appointmentsData.length) {
      var noDataRow = document.createElement('tr');
      var noDataCell = document.createElement('td');
      noDataCell.colSpan = headers.length;
      noDataCell.textContent = 'Sem dados financeiros para este mês.';
      noDataCell.style.textAlign = 'center';
      noDataRow.appendChild(noDataCell);
      tbody.appendChild(noDataRow);
    } else {
      appointmentsData.forEach(appointment => {
        var tr = document.createElement('tr');
  
        var tdClient = document.createElement('td');
        tdClient.textContent = appointment.clientName;
        tr.appendChild(tdClient);
  
        var tdCount = document.createElement('td');
        tdCount.textContent = appointment.appointmentCount;
        tr.appendChild(tdCount);
  
        tbody.appendChild(tr);
      });
    }
  
    var cancelButton = createElementGeneric('button', 'cancelButton', 'Retroceder');
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createFinancialDetails());
    });
  
    table.appendChild(tbody);
    tableDiv.appendChild(table);
    tableDiv.appendChild(cancelButton);
    return tableDiv;
  }
