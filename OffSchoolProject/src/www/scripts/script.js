// Tiago Ramada & Bernardo Vaz

"use strict";

/**
 * @class SetUp
 * 
 * @description Class to set up the main page
 * 
 */
class SetUp {
  constructor() {
    this.initialize();
  }

  /**
   * @function initialize
   * 
   * @description Function to initialize the main page
   * 
   * @returns {element} mainPageContainer
   */
  async initialize() {
    createNavBar();
    const mainPageContainer = createElementGeneric('div', 'mainPageContainer');
    mainPageContainer.appendChild(await createTodayAppointmentsTable());
    mainPageContainer.appendChild(await createTomorrowAppointmentsTable());
    document.documentElement.getElementsByTagName('main')[0].appendChild(mainPageContainer);
  }
}

// ********** Variables **********
let clients = [];
let filteredClients = [];
let employees = [];
let priceTable = [];
let stocks = [];
let filteredStocks = [];
let owner = undefined;
let client = undefined;
let selectedRow = null;


// ********** Setting Main Page **********
/**
 * @function createMainSearchBar
 * 
 * @description Function to create/show the search bar
 * 
 */
var createMainSearchBar = function () {
  const div = createElementGeneric('div', 'search-bar');
  const searchbar = createElementGeneric('div', 'search-bar-complete');
  const searchButton = createElementGeneric('button', 'search-bar-button', 'Pesquisar');
  const input = createElementGeneric('input', 'search-bar-input');
  input.placeholder = 'Pesquisar por cliente (Nome ou Nif)';
  searchbar.appendChild(input);
  searchbar.appendChild(searchButton);
  div.appendChild(searchbar);
  document.documentElement.getElementsByTagName('main')[0].appendChild(div);

  searchButton.addEventListener('click', async function () {
    const searchValue = input.value.trim().toLowerCase();
    if (searchValue === "") {
      filteredClients = [];
      clearTableFromScreen();
      createMainSearchBar();
      createMainTable();
      return;
    }
    filteredClients = clients.filter(client =>
      client.getName().toLowerCase().includes(searchValue) ||
      client.getNif().toLowerCase().includes(searchValue)
    );
    clearTableFromScreen();
    createMainSearchBar();
    createMainTable();
  });
}

/**
 * @function createNavBar
 * 
 * @description Function to create/show the navigation bar
 * 
 * @returns {element} nav
 * 
 */
var createNavBar = function () {
  const nav = createElementGeneric('nav', 'navbar');
  const logoContainer = createElementGeneric('div', 'navbar-logo-container');
  const logo = createElementGeneric('img', 'navbar-logo');
  logo.src = "img/IconNoBackground.png";
  const textContainer = createElementGeneric('div', 'navbar-text');
  const line1 = createElementGeneric('span', 'navbar-text-line', 'UserName');
  const line2 = createElementGeneric('span', 'navbar-text-line', 'HAIR');
  const line3 = createElementGeneric('span', 'navbar-text-line', 'STYLIST');
  textContainer.appendChild(line1);
  textContainer.appendChild(line2);
  textContainer.appendChild(line3);
  logoContainer.appendChild(logo);
  logoContainer.appendChild(textContainer);

  const pagesContainer = createElementGeneric('div', 'navbar-pages-container');
  const mainPage = createElementGeneric('button', 'btn-main-page', 'Página principal');
  const clientsManagement = createElementGeneric('button', 'btn-client-management', 'Clientes');
  const employeeManagement = createElementGeneric('button', 'btn-employee-management', 'Funcionários');
  const priceTableManagement = createElementGeneric('button', 'btn-pricetable-management', 'Preçario');
  const stockManagement = createElementGeneric('button', 'btn-stock-management', 'Gestão de Stock');
  const financialManagement = createElementGeneric('button', 'btn-financial-management', 'Gestão Financeira');
  
  mainPage.addEventListener('click', async function () {
    checkForm();
    clearTableFromScreen();
    const mainPageContainer = createElementGeneric('div', 'mainPageContainer');
    mainPageContainer.appendChild(await createTodayAppointmentsTable());
    mainPageContainer.appendChild(await createTomorrowAppointmentsTable());
    document.documentElement.getElementsByTagName('main')[0].appendChild(mainPageContainer);
  });
  clientsManagement.addEventListener('click', function () {
    checkForm();
    clearTableFromScreen();
    createMainSearchBar();
    createMainTable();
  });
  employeeManagement.addEventListener('click', function () {
    checkForm();
    clearTableFromScreen();
    createManagerTable();
  });
  priceTableManagement.addEventListener('click', async function () {
    checkForm();
    clearTableFromScreen();
    document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
  });
  stockManagement.addEventListener('click', async function () {
    checkForm();
    clearTableFromScreen();
    createStockSearchBar();
    document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
  });
  financialManagement.addEventListener('click', async function () {
    checkForm();
    clearTableFromScreen();
    document.documentElement.getElementsByTagName('main')[0].appendChild(await createFinancialDetails());
  });
  pagesContainer.appendChild(mainPage);
  pagesContainer.appendChild(clientsManagement);
  pagesContainer.appendChild(employeeManagement);
  pagesContainer.appendChild(priceTableManagement);
  pagesContainer.appendChild(stockManagement);
  pagesContainer.appendChild(financialManagement);
  nav.appendChild(logoContainer);
  nav.appendChild(pagesContainer);
  document.body.insertBefore(nav, document.body.firstChild);
}

/**
 * @function createMainTable
 * 
 * @description Function to create/show the main table
 * 
 */
var createMainTable = async function () {
  if (filteredClients.length > 0) {
    clients = filteredClients;
  } else {
    const data = await fetchJson('clients');
    clients = data.map(client => new Client(client.id, client.name, client.age, client.email, client.address, client.nif));
  }
  const div = createElementGeneric('div', 'clientsDiv');
  const tableTitle = createElementGeneric('h2', 'table-title', 'Tabela de Clientes');
  const table = createElementGeneric('table', 'clients-table');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  let th = document.createElement('th');
  th.textContent = 'Nome';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Telefone';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Email';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'Endereço de Morada';
  tr.appendChild(th);
  th = document.createElement('th');
  th.textContent = 'NIF';
  tr.appendChild(th);
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = createElementGeneric('tbody', 'clientsTableBody');
  for (var i = 0; i < clients.length; i++) {
    const tr = document.createElement('tr');
    tr.setAttribute('index', i);
    tr.addEventListener('click', function (event) {
      selectRow(event);
    });
    let td = document.createElement('td');
    td.textContent = clients[i].getName();
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = clients[i].getAge();
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = clients[i].getEmail();
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = clients[i].getAddress();
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = clients[i].getNif();
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  div.appendChild(tableTitle);
  div.appendChild(table);
  div.appendChild(createTableButtons());
  document.documentElement.getElementsByTagName('main')[0].appendChild(div);
};

/**
 * @function createTableButtons
 * 
 * @description Function to create the buttons to main table
 * 
 */
var createTableButtons = function () {
  var buttonsDiv = createElementGeneric('div', 'buttonsDiv');
  buttonsDiv.appendChild(createElementGeneric('button', 'createButton', 'Adicionar Cliente'));
  buttonsDiv.appendChild(createElementGeneric('button', 'deleteButton', 'Remover Cliente'));
  buttonsDiv.appendChild(createElementGeneric('button', 'detailsButton', 'Visualizar Dados do Cliente'));
  var createButton = buttonsDiv.querySelector('.createButton');
  var deleteButton = buttonsDiv.querySelector('.deleteButton');
  var detailsButton = buttonsDiv.querySelector('.detailsButton');
  deleteButton.disabled = true;
  detailsButton.disabled = true;
  createButton.addEventListener('click', function () {
    checkForm();
    clearTableFromScreen();
    document.documentElement.getElementsByTagName('main')[0].appendChild(showCreateClientForm());
  });
  deleteButton.addEventListener('click', async function () {
    if (selectedRow) {
      checkForm();
      const clientId = clients[selectedRow].getId();
      await Client.removeClient(clientId);
      clearTableFromScreen();
      createMainSearchBar();
      createMainTable();
    }
  });
  detailsButton.addEventListener('click', async function () {
    if (selectedRow) {
      checkForm();
      const clientId = clients[selectedRow].getId();
      await Client.getClientById(clientId);
      clearTableFromScreen();
      selectedRow = null;
      const mainContainer = createElementGeneric('div', 'mainContainer');
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(clientId));
      document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
    }
  });
  return buttonsDiv;
}