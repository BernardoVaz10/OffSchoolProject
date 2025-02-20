"use strict";

/**
 * Class Client_Description
 * 
 * @param {number} idClient
 * @param {string} description
 * 
 */
class Client_Description {
    constructor(idClient, description) {
        this.idClient = idClient;
        this.description = description;
    }

    getIdClient() {
        return this.idClient;
    }

    getDescription() {
        return this.description;
    }

    setDescription(description) {
        this.description = description;
    }
}

// ********** Functions for Adding, Removing, and Fetching Clients_Descriptions **********
/**
 * Add a description to the client
 * 
 * @param {number} idClient
 * @param {string} description
 * @param {number} appointmentDate
 * @param {number} price
 * 
 */
Client_Description.addClientDescription = async function (idClient, description, appointmentDate, price, employee_id, technicalSheet) {
    const result = await fetchJson(`/clients/${idClient}/description`, 'POST', {
        description,
        appointmentDate,
        price,
        employee_id,
        technicalSheet
    });
    if (!result) throw new Error('Failed to add Client Description');
    return new Client_Description(idClient, description, appointmentDate, price, employee_id, technicalSheet);
}

/**
 * Remove a description to the client
 * 
 * @param {number} idClient
 * @param {number} appointmentId
 * 
 */
Client_Description.removeClientDescription = async function (idClient, appointmentId) {
    const result = await fetchJson(`/clients/${idClient}/description`, 'DELETE', {
        appointmentId
    });
    if (!result) throw new Error('Failed to remove Client Description');
}

/**
 * Show the histpry of the client (description)
 * 
 * @param {number} id
 * 
 */
Client_Description.getClientDescription = async function (id) {
    const result = await fetchJson(`/clients/${id}/description`, 'GET');
    if (!result) throw new Error('Failed to load Client Description');
    return result;
}

/**
 * Update a payment method of the client
 * 
 * @param {number} idClient
 * @param {string} paymentMethod
 * 
 */
Client_Description.updateClientPaymentMethod = async function (id, paymentMethod) {
    const result = await fetchJson(`/clients/${id}/paymentMethod`, 'PUT', {
        paymentMethod
    });
    if (!result) throw new Error('Failed to update Client Payment Method');
}

/**
 * Update a description to the client
 * 
 * @param {number} idClient
 * @param {string} description
 * 
 */
Client_Description.updateClientDescription = async function (idClient, appointmentId, appointmentDate, price, description, technicalSheet, employee_id) {
    const result = await fetchJson(`/clients/${idClient}/description`, 'PUT', {
        appointmentId,
        appointmentDate,
        price,
        description,
        technicalSheet,
        employee_id
    });
    if (!result) throw new Error('Failed to update Client description');
}

/**
 * @function createDescriptionTable
 * 
 * @param {number} clientId
 * 
 * @description Function to create/show the description table
 * 
 */
var createDescriptionTable = async function (clientId) {
    const data = await fetchJson('employees');
    employees = data.map(employee => new Employee(employee.id, employee.name));
  
    const div = createElementGeneric('div', 'descriptionDiv');
    const tableTitle = createElementGeneric('h2', 'descriptionTableTitle', 'Histórico de Marcações');
    const table = createElementGeneric('table', 'descriptionTable');
  
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    const thAppointment = document.createElement('th');
    thAppointment.textContent = 'Data da Marcação';
    headerRow.appendChild(thAppointment);
  
    const thEmployee = document.createElement('th');
    thEmployee.textContent = 'Funcionário';
    headerRow.appendChild(thEmployee);
  
    const thPrice = document.createElement('th');
    thPrice.textContent = 'Preço';
    headerRow.appendChild(thPrice);
  
    const thDescription = document.createElement('th');
    thDescription.textContent = 'Descrição';
    headerRow.appendChild(thDescription);

    const thPaymentMethod = document.createElement('th');
    thPaymentMethod.textContent = 'Método de Pagamento';
    headerRow.appendChild(thPaymentMethod);
  
    const thTechnicalSheet = document.createElement('th');
    thTechnicalSheet.textContent = 'Ficha Técnica';
    headerRow.appendChild(thTechnicalSheet);
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
    div.appendChild(tableTitle);
  
    const tbody = createElementGeneric('tbody', 'descriptionTableBody');
  
    await Client_Description.getClientDescription(clientId).then((descriptions) => {
      descriptions.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
      descriptions.forEach((desc, i) => {
        const tr = document.createElement('tr');
        tr.setAttribute('index', i);
        tr.addEventListener('click', selectRow);
        const tdAppointment = document.createElement('td');
        tdAppointment.textContent = desc.appointmentDate ? new Date(desc.appointmentDate).toLocaleString('pt-PT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) :
          'N/A';
        tr.appendChild(tdAppointment);
  
        const tdEmployee = document.createElement('td');
        const employee = employees.find(employee => employee.getId() === desc.employee_id);
        tdEmployee.textContent = employee ? employee.getName() : 'N/A';
        tr.appendChild(tdEmployee);
  
        const tdPrice = document.createElement('td');
        tdPrice.textContent = desc.price !== undefined ? desc.price + '€' : 'N/A';
        tr.appendChild(tdPrice);
  
        const tdDescription = document.createElement('td');
        tdDescription.textContent = desc.description;
        tr.appendChild(tdDescription);

        const tdPaymentMethod = document.createElement('td');
        tdPaymentMethod.textContent = desc.paymentMethod || 'N/A';
        tr.appendChild(tdPaymentMethod);
  
        const tdTechnicalSheet = document.createElement('td');
        tdTechnicalSheet.textContent = desc.technicalSheet || 'N/A';
        tr.appendChild(tdTechnicalSheet);
  
        tbody.appendChild(tr);
      });
    });
    table.appendChild(tbody);
    div.appendChild(table);
    div.appendChild(createDescriptionButtons());
    return div;
  }
  
  /**
   * @function createDescriptionButtons
   * 
   * @param {number} clientId
   * 
   * @description Function to create/show the buttons to description table
   * 
   */
  var createDescriptionButtons = function () {
    var buttonsDiv = createElementGeneric('div', 'descriptionButtons');
    var addAppointmentButton = createElementGeneric('button', 'addAppointment', 'Adicionar Marcação');
    var removeAppointmentButton = createElementGeneric('button', 'removeAppointment', 'Remover Marcação');
    removeAppointmentButton.disabled = true;
    var editAppointmentButton = createElementGeneric('button', 'editAppointment', 'Editar Marcação');
    editAppointmentButton.disabled = true;
  
    addAppointmentButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await showCreateAppointmentForm());
    });
  
    removeAppointmentButton.addEventListener('click', async function () {
      if (selectedRow) {
        checkForm();
        const appointmentIndex = selectedRow;
        const descriptions = (await Client_Description.getClientDescription(client.getId())).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        const appointmentId = descriptions[appointmentIndex].id;

        await Client_Description.removeClientDescription(client.getId(), appointmentId);
        clearTableFromScreen();
        const mainContainer = createElementGeneric('div', 'mainContainer');
        mainContainer.appendChild(showDetailsClient());
        mainContainer.appendChild(await createDescriptionTable(client.getId()));
        document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
      }
    });
  
    editAppointmentButton.addEventListener('click', async function () {
      if (selectedRow) {
        checkForm();
        const appointmentIndex = selectedRow;
        const descriptions = (await Client_Description.getClientDescription(client.getId())).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
        const appointmentId = descriptions[appointmentIndex].id;
        const appointment = descriptions[appointmentIndex];
        clearTableFromScreen();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await showEditAppointmentForm(appointment, appointmentId));
      }
    });
    buttonsDiv.appendChild(addAppointmentButton);
    buttonsDiv.appendChild(removeAppointmentButton);
    buttonsDiv.appendChild(editAppointmentButton);
    return buttonsDiv;
  }
  
  /**
   * @function showDetailsClient
   * 
   * @description Function to show the details of the client
   * 
   */
  var showDetailsClient = function () {
    var div = createElementGeneric('div', 'detailsDiv');
    var h2 = createElementGeneric('h2', 'detailsTitle', 'Detalhes do Cliente');
    div.appendChild(h2);
    var p = createElementGeneric('p', 'detailsName', 'Nome: ' + client.getName());
    div.appendChild(p);
    p = createElementGeneric('p', 'detailsAge', 'Telefone: ' + client.getAge());
    div.appendChild(p);
    p = createElementGeneric('p', 'detailsEmail', 'Email: ' + client.getEmail());
    div.appendChild(p);
    p = createElementGeneric('p', 'detailsAddress', 'Endereço de Morada: ' + client.getAddress());
    div.appendChild(p);
    p = createElementGeneric('p', 'detailsNif', 'NIF: ' + client.getNif());
    div.appendChild(p);
  
    var divButtons = createElementGeneric('div', 'detailsButtons');
  
    var editarDados = createElementGeneric('button', 'editButton', 'Editar Dados');
    divButtons.appendChild(editarDados);
  
    var backButton = createElementGeneric('button', 'backButton', 'Retroceder');
    divButtons.appendChild(backButton);
  
    editarDados.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      editDetailsClient();
    });
  
    backButton.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      selectedRow = null;
      createMainSearchBar();
      createMainTable();
      return;
    });
    div.appendChild(divButtons);
    return div;
  }
  
  /**
   * @function editDetailsClient
   * 
   * @description Function to edit the details of the client
   * 
   */
  var editDetailsClient = function () {
    var div = createElementGeneric('div', 'editDetailsDiv');
    var h2 = createElementGeneric('h2', 'editDetailsTitle', 'Editar Cliente');
    div.appendChild(h2);
  
    var nameInput = createElementGeneric('input', 'editName');
    nameInput.value = client.getName();
    div.appendChild(createLabeledInput('Nome:', nameInput));
  
    var ageInput = createElementGeneric('input', 'editAge');
    ageInput.value = client.getAge();
    div.appendChild(createLabeledInput('Telefone:', ageInput));
  
    var emailInput = createElementGeneric('input', 'editEmail');
    emailInput.value = client.getEmail();
    div.appendChild(createLabeledInput('Email:', emailInput));
  
    var addressInput = createElementGeneric('input', 'editAddress');
    addressInput.value = client.getAddress();
    div.appendChild(createLabeledInput('Endereço de Morada:', addressInput));
  
    var nifInput = createElementGeneric('input', 'editNif');
    nifInput.value = client.getNif();
    div.appendChild(createLabeledInput('NIF:', nifInput));
  
    var divButtons = createElementGeneric('div', 'editDetailsButtons');
  
    var saveButton = createElementGeneric('button', 'saveButton', 'Guardar');
    var cancelButton = createElementGeneric('button', 'cancelButton', 'Cancelar');
  
    saveButton.addEventListener('click', async function () {
      if (!checkDataForm(nameInput.value, ageInput.value, emailInput.value, addressInput.value, nifInput.value)) {
        return;
      };
      await Client.updateClient(client.getId(), nameInput.value, ageInput.value, emailInput.value, addressInput.value, nifInput.value);
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric('div', 'mainContainer');
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.getId()));
      document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
    });
  
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric('div', 'mainContainer');
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.getId()));
      document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
    });
    divButtons.appendChild(saveButton);
    divButtons.appendChild(cancelButton);
    div.appendChild(divButtons);
    document.documentElement.getElementsByTagName('main')[0].appendChild(div);
  }
  