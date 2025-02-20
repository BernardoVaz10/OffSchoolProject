"use strict";

/**
 * Class Client
 * 
 * @param {number} id
 * @param {string} name
 * @param {number} age
 * @param {string} email
 * @param {string} address
 * @param {string} nif
 * 
 */
class Client {
    constructor(id, name, age, email, address, nif) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
        this.nif = nif;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getAge() {
        return this.age;
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

// ********** Functions for Adding, Removing, and Fetching Clients **********
/**
 * Add Clients to the database
 * 
 * @param {number} id
 * @param {string} name
 * @param {number} age
 * @param {string} email
 * @param {string} address
 * @param {string} nif
 * 
 */
Client.addClient = async function (name, age, email, address, nif) {
    const result = await fetchJson('/clients', 'POST', {
        name,
        age,
        email,
        address,
        nif
    });
    if (!result) throw new Error('Failed to add Client');
    clients.push(new Client(name, age, email, address, nif));
};

/**
 * Remove Client from the database
 * 
 * @param {number} id
 * 
 */
Client.removeClient = async function (id) {
    const result = await fetchJson(`/clients/${id}`, 'DELETE');
    if (!result) throw new Error('Failed to remove Client');
    clients = clients.filter((client) => client.getId() !== id);
};

/**
 * Get Client from the database
 * 
 * @param {number} id
 * 
 */
Client.getClientById = async function (id) {
    const result = await fetchJson(`/clients/${id}`, 'GET');
    if (!result) throw new Error('Failed to load Client');
    client = new Client(result[0].id, result[0].name, result[0].age, result[0].email, result[0].address, result[0].nif);
};

/**
 * Update Client from the database
 * 
 * @param {number} id
 * @param {string} name
 * @param {number} age
 * @param {string} email
 * @param {string} address
 * @param {string} nif
 * 
 */
Client.updateClient = async function (id, name, age, email, address, nif) {
    const result = await fetchJson(`/clients/${id}`, 'PUT', {
        name,
        age,
        email,
        address,
        nif
    });
    if (!result) throw new Error('Failed to update Client');
    const index = clients.findIndex((type) => type.getId() === id);
    clients[index] = new Client(id, name, age, email, address, nif);
    client = new Client(id, name, age, email, address, nif);
}


/**
 * @function showCreateClientForm
 * 
 * @description Function to show the form to create a client
 * 
 */
var showCreateClientForm = function () {
    var div = createElementGeneric('div', 'createClientDiv');
    var form = createElementGeneric('form', 'clientForm');
  
    var labelName = createElementGeneric('label', 'clientNameLabel');
    labelName.textContent = 'Nome: ';
    form.appendChild(labelName);
    var inputName = createElementGeneric('input', 'clientName');
    inputName.type = 'text';
    inputName.required = true;
    form.appendChild(inputName);
  
    var labelAge = createElementGeneric('label', 'clientAgeLabel');
    labelAge.textContent = 'Telefone: ';
    form.appendChild(labelAge);
    var inputAge = createElementGeneric('input', 'clientAge');
    inputAge.type = 'number';
    inputAge.required = true;
    form.appendChild(inputAge);
  
    var labelEmail = createElementGeneric('label', 'clientEmailLabel');
    labelEmail.textContent = 'Email: ';
    form.appendChild(labelEmail);
    var inputEmail = createElementGeneric('input', 'clientEmail');
    inputEmail.type = 'text';
    inputEmail.required = true;
    form.appendChild(inputEmail);
  
    var labelAddress = createElementGeneric('label', 'clientAddressLabel');
    labelAddress.textContent = 'Endereço de Morada: ';
    form.appendChild(labelAddress);
    var inputAddress = createElementGeneric('input', 'clientAddress');
    inputAddress.type = 'text';
    inputAddress.required = true;
    form.appendChild(inputAddress);
  
    var labelNif = createElementGeneric('label', 'clientNifLabel');
    labelNif.textContent = 'NIF: ';
    form.appendChild(labelNif);
    var inputNif = createElementGeneric('input', 'clientNif');
    inputNif.type = 'number';
    inputNif.required = true;
    form.appendChild(inputNif);
  
    var buttonsDiv = createElementGeneric('div', 'clientButtons');
  
    var saveButton = createElementGeneric('button', 'createClientButton', 'Adicionar');
    buttonsDiv.appendChild(saveButton);
  
    var cancelButton = createElementGeneric('button', 'cancelClientButton', 'Cancelar');
    buttonsDiv.appendChild(cancelButton);
  
    saveButton.addEventListener('click', async function (event) {
      event.preventDefault();
      let name = inputName.value.trim();
      let age = inputAge.value;
      let email = inputEmail.value.trim();
      let address = inputAddress.value.trim();
      let nif = inputNif.value.trim();
      if (!checkDataForm(name, age, email, address, nif)) {
        return;
      };
      await Client.addClient(name, age, email || 'Sem email', address || 'Sem Morada', nif || '000000000');
      checkForm();
      clearTableFromScreen();
      createMainSearchBar();
      createMainTable();
  
    });
  
    cancelButton.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      createMainSearchBar();
      createMainTable();
      return;
    });
    div.appendChild(form);
    div.appendChild(buttonsDiv);
    return div;
  }