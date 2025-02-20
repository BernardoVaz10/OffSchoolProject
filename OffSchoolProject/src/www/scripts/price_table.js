"use strict";

/**
 * @function createPriceTable
 *  
 * @description Function to create/show the price table
 * 
 * @returns {element} tableDiv
 */
var createPriceTable = async function () {
    priceTable = await fetchJson('price_table');
    var tableDiv = createElementGeneric('div', 'priceTableDiv');
    var h2 = createElementGeneric('h2', 'priceTableTitle', 'Preçário');
    tableDiv.appendChild(h2);
  
    var table = createElementGeneric('table', 'priceTable');
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
  
    const headers = ['Serviço', 'Preço'];
  
    headers.forEach(header => {
      var th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    var tbody = createElementGeneric('tbody', 'priceTableBody');
  
    if (!priceTable.length) {
      var noDataRow = document.createElement('tr');
      var noDataCell = document.createElement('td');
      noDataCell.colSpan = headers.length;
      noDataCell.textContent = 'Sem dados de preçário.';
      noDataCell.style.textAlign = 'center';
      noDataRow.appendChild(noDataCell);
      tbody.appendChild(noDataRow);
    } else {
      let i = 0;
      priceTable.forEach(service => {
        var tr = document.createElement('tr');
        tr.setAttribute('index', i);
        tr.addEventListener('click', function (event) {
          selectRow(event);
        });
  
        var tdService = document.createElement('td');
        tdService.textContent = service.type + ' - ' + (service.subtype || 'N/A');
        tr.appendChild(tdService);
  
        var tdPrice = document.createElement('td');
        tdPrice.textContent = service.price + '€';
        tr.appendChild(tdPrice);
  
        tbody.appendChild(tr);
        i++;
      });
    }
  
    table.appendChild(tbody);
    tableDiv.appendChild(table);
  
    var buttonsDiv = createElementGeneric('div', 'priceTableButtons');
  
    var addButton = createElementGeneric('button', 'addPriceTableButton', 'Adicionar Preçário');
    var editButton = createElementGeneric('button', 'editPriceTableButton', 'Editar Preçário');
    editButton.disabled = true;
    var deleteButton = createElementGeneric('button', 'deletePriceTableButton', 'Remover Preçário');
    deleteButton.disabled = true;
  
    addButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(showCreatePriceTableForm());
    });
  
    editButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(showEditPriceTableForm());
    });
  
    deleteButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      deleteFromPriceTable();
    });
  
    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);
  
    tableDiv.appendChild(buttonsDiv);
  
    return tableDiv;
  }
  
  /**
   * @function showCreatePriceTableForm
   * 
   * @description Function to show the form to create a price table
   * 
   * @returns {element} div
   * */
  var showCreatePriceTableForm = function () {
    var div = createElementGeneric('div', 'createPriceTableDiv');
    var form = createElementGeneric('form', 'priceTableForm');
  
    var labelService = createLabeledInput('Serviço:', createElementGeneric('input', 'serviceInput'));
    form.appendChild(labelService);
  
    var labelSubtype = createLabeledInput('Subtipo:', createElementGeneric('input', 'subtypeInput'));
    form.appendChild(labelSubtype);
  
    var labelPrice = createLabeledInput('Preço:', createElementGeneric('input', 'priceInput'));
    form.appendChild(labelPrice);
  
    var buttonsDiv = createElementGeneric('div', 'priceTableButtons');
    var saveButton = createElementGeneric('button', 'savePriceTableButton', 'Adicionar');
    buttonsDiv.appendChild(saveButton);
  
    var cancelButton = createElementGeneric('button', 'cancelPriceTableButton', 'Cancelar');
    buttonsDiv.appendChild(cancelButton);
  
    saveButton.addEventListener('click', async function (event) {
      event.preventDefault();
      var service = document.getElementById('serviceInput').value;
      var subtype = document.getElementById('subtypeInput').value;
      var price = document.getElementById('priceInput').value;
      if (!service || !price) {
        alert('Preencha os campos obrigatórios (Serviço prestado e Preço)');
        return;
      }
  
      const newType = service.trim().toLowerCase();
      const newSubtype = (subtype || "").trim().toLowerCase();
      const currentPriceTable = await fetchJson('price_table');
      const exists = currentPriceTable.some(item =>
        item.type.trim().toLowerCase() === newType &&
        ((item.subtype || "").trim().toLowerCase() === newSubtype)
      );
      if (exists) {
        alert('Esse tipo de serviço já existe!');
        return;
      }
  
      const result = await fetchJson('/price_table', 'POST', {
        type: service,
        subtype,
        price
      });
      if (!result) {
        alert('Erro ao adicionar ao preçário');
        return;
      }
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
    });
  
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
    });
  
    div.appendChild(form);
    div.appendChild(buttonsDiv);
    return div;
  }
  
  /**
   * @function showEditPriceTableForm
   * 
   * @description Function to show the form to edit a price table
   * 
   * @returns {element} div
   * */
  var showEditPriceTableForm = function () {
    if (!selectedRow) {
      alert('Selecione uma linha para editar');
      return;
    }
    var index = selectedRow;
    var service = priceTable[index].type;
    var subtype = priceTable[index].subtype;
    var price = priceTable[index].price;
  
    var div = createElementGeneric('div', 'editPriceTableDiv');
    var form = createElementGeneric('form', 'editPriceTableForm');
  
    var labelService = createLabeledInput('Serviço:', createElementGeneric('input', 'serviceInput'));
    labelService.querySelector('input').value = service;
    form.appendChild(labelService);
  
    var labelSubtype = createLabeledInput('Subtipo:', createElementGeneric('input', 'subtypeInput'));
    labelSubtype.querySelector('input').value = subtype;
    form.appendChild(labelSubtype);
  
    var labelPrice = createLabeledInput('Preço:', createElementGeneric('input', 'priceInput'));
    labelPrice.querySelector('input').value = price;
    form.appendChild(labelPrice);
  
    var buttonsDiv = createElementGeneric('div', 'editButtonsPriceTableDiv');
  
    var saveButton = createElementGeneric('button', 'savePriceTableButton', 'Guardar');
    buttonsDiv.appendChild(saveButton);
  
    var cancelButton = createElementGeneric('button', 'cancelPriceTableButton', 'Cancelar');
    buttonsDiv.appendChild(cancelButton);
  
    saveButton.addEventListener('click', async function (event) {
      event.preventDefault();
      var service = document.getElementById('serviceInput').value;
      var subtype = document.getElementById('subtypeInput').value;
      var price = document.getElementById('priceInput').value;
      if (!service || !price) {
        alert('Preencha os campos obrigatórios (Serviço prestado e Preço)');
        return;
      }
      const id = priceTable[index].id;
      const result = await fetchJson(`/price_table/${id}`, 'PUT', {
        type: service,
        subtype,
        price
      });
      if (!result) {
        alert('Erro ao editar o preçário');
        return;
      }
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
    });
  
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
    });
  
    div.appendChild(form);
    div.appendChild(buttonsDiv);
    return div;
  }
  
  /**
   * @function deleteFromPriceTable
   * 
   * @description Function to delete a row from the price table
   * */
  var deleteFromPriceTable = async function () {
    if (selectedRow) {
      var index = selectedRow;
      var id = priceTable[index].id;
      await fetchJson(`/price_table/${id}`, 'DELETE').then(async () => {
        checkForm();
        clearTableFromScreen();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await createPriceTable());
      });
    }
  }
  