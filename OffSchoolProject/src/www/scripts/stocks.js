"use strict";

var createStockSearchBar = function () {
    const div = createElementGeneric('div', 'search-bar');
    const searchbar = createElementGeneric('div', 'search-bar-complete');
    const searchButton = createElementGeneric('button', 'search-bar-button', 'Pesquisar');
    const input = createElementGeneric('input', 'search-bar-input');
    input.placeholder = 'Pesquisar por produto (Nome ou Referência)';
    searchbar.appendChild(input);
    searchbar.appendChild(searchButton);
    div.appendChild(searchbar);
    document.documentElement.getElementsByTagName('main')[0].appendChild(div);

    searchButton.addEventListener('click', async function () {
        const searchValue = input.value.trim().toLowerCase();
        if (searchValue === "") {
            filteredStocks = [];
            clearTableFromScreen();
            createStockSearchBar();
            document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
            return;
        }
        filteredStocks = stocks.filter(stock =>
            stock.name.toLowerCase().includes(searchValue) ||
            stock.reference.toLowerCase().includes(searchValue)
        );
        clearTableFromScreen();
        createStockSearchBar();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
    });
}

/**
 * 
 * @function createStockTable
 * 
 * @description Function to create/show the stock table
 * 
 * @returns {element} tableDiv
 */
var createStockTable = async function () {
    if (filteredStocks.length > 0) {
        stocks = filteredStocks;
    } else {
        stocks = await fetchJson('stocks');
    }

    var tableDiv = createElementGeneric('div', 'stocksTableDiv');
    var h2 = createElementGeneric('h2', 'stocksTableTitle', 'Stocks');
    tableDiv.appendChild(h2);

    var table = createElementGeneric('table', 'stocksTable');
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    const headers = ['Produto', 'Quantidade', 'Referência'];

    headers.forEach(header => {
        var th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = createElementGeneric('tbody', 'stocksTableBody');

    if (!stocks.length) {
        var noDataRow = document.createElement('tr');
        var noDataCell = document.createElement('td');
        noDataCell.colSpan = headers.length;
        noDataCell.textContent = 'Sem stocks.';
        noDataCell.style.textAlign = 'center';
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
    } else {
        let i = 0;
        stocks.forEach(stock => {
            var tr = document.createElement('tr');
            tr.setAttribute('index', i);
            tr.addEventListener('click', function (event) {
                selectRow(event);
            });

            var tdProduct = document.createElement('td');
            tdProduct.textContent = stock.name;
            tr.appendChild(tdProduct);

            var tdQuantity = document.createElement('td');

            var quantitySpan = document.createElement('span');
            quantitySpan.textContent = stock.quantity;
            tdQuantity.appendChild(quantitySpan);

            var plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.addEventListener('click', function (e) {
                e.stopPropagation();

                stock.quantity = Number(stock.quantity) + 1;
                quantitySpan.textContent = stock.quantity;
                fetchJson(`stocks/${stock.id}`, 'PUT', {
                    quantity: stock.quantity
                });
            });
            tdQuantity.appendChild(plusButton);

            var minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.addEventListener('click', function (e) {
                e.stopPropagation();

                if (Number(stock.quantity) > 0) {
                    stock.quantity = Number(stock.quantity) - 1;
                    quantitySpan.textContent = stock.quantity;
                    fetchJson(`stocks/${stock.id}`, 'PUT', {
                        quantity: stock.quantity
                    });
                }
            });
            tdQuantity.appendChild(minusButton);
            tr.appendChild(tdQuantity);

            // Reference cell
            var tdReference = document.createElement('td');
            tdReference.textContent = stock.reference;
            tr.appendChild(tdReference);

            tbody.appendChild(tr);
            i++;
        });
    }

    table.appendChild(tbody);
    tableDiv.appendChild(table);

    var buttonsDiv = createElementGeneric('div', 'stocksButtons');

    var addButton = createElementGeneric('button', 'addStockButton', 'Adicionar');
    addButton.addEventListener('click', async function () {
        checkForm();
        clearTableFromScreen();
        document.documentElement.getElementsByTagName('main')[0].appendChild(createStockForm());
    });

    var editButton = createElementGeneric('button', 'editStockButton', 'Editar');
    editButton.disabled = true;
    editButton.addEventListener('click', async function () {
        checkForm();
        clearTableFromScreen();
        document.documentElement.getElementsByTagName('main')[0].appendChild(showEditStockForm());
    });

    var deleteButton = createElementGeneric('button', 'deleteStockButton', 'Remover');
    deleteButton.disabled = true;
    deleteButton.addEventListener('click', async function () {
        checkForm();
        clearTableFromScreen();
        var id = stocks[selectedRow].id;
        await fetchJson(`stocks/${id}`, 'DELETE').then(async () => {
            createStockSearchBar();
            document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
        });
    });

    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);
    tableDiv.appendChild(buttonsDiv);

    return tableDiv;
}

/**
 *
 * @function createStockForm
 * 
 * @description Function to create the stock form
 * 
 * @returns {element} formDiv
 */
var createStockForm = function () {
    var formDiv = createElementGeneric('div', 'stockFormDiv');

    var form = createElementGeneric('form', 'stockForm');

    var name = createLabeledInput('Nome:', createElementGeneric('input', 'stockName', 'text'));
    form.appendChild(name);

    var quantity = createLabeledInput('Quantidade:', createElementGeneric('input', 'stockQuantity', 'number'));
    form.appendChild(quantity);

    var reference = createLabeledInput('Referência:', createElementGeneric('input', 'stockReference', 'text'));
    form.appendChild(reference);

    var buttonsDiv = createElementGeneric('div', 'stockFormButtons');

    var submitButton = createElementGeneric('button', 'submitStockButton', 'Adicionar');
    submitButton.addEventListener('click', async function (event) {
        event.preventDefault();

        var nameInput = document.getElementById('stockName').value.trim();
        var quantityInput = document.getElementById('stockQuantity').value.trim();
        var referenceInput = document.getElementById('stockReference').value.trim() || 'N/A';

        if (!nameInput || !quantityInput || !referenceInput) {
            alert('Preencha todos os campos');
            return;
        }

        await fetchJson('stocks', 'POST', {
            name: nameInput,
            quantity: quantityInput,
            reference: referenceInput
        }).then(async () => {
            checkForm();
            clearTableFromScreen();
            createStockSearchBar();
            document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
        });
    });

    var cancelButton = createElementGeneric('button', 'cancelStockButton', 'Cancelar');
    cancelButton.addEventListener('click', async function () {
        checkForm();
        clearTableFromScreen();
        createStockSearchBar();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
    });

    buttonsDiv.appendChild(submitButton);
    buttonsDiv.appendChild(cancelButton);
    form.appendChild(buttonsDiv);

    formDiv.appendChild(form);
    return formDiv;
}

/**
 * 
 * @function showEditStockForm
 *
 * @description Function to show the form to edit a stock
 *
 * @returns {element} div
 */
var showEditStockForm = function () {

    var index = selectedRow;
    var name = stocks[index].name;
    var quantity = stocks[index].quantity;
    var reference = stocks[index].reference;

    var div = createElementGeneric('div', 'editStockDiv');
    var form = createElementGeneric('form', 'editStockForm');

    // Campo: Produto
    var labelProduct = createLabeledInput('Produto:', createElementGeneric('input', 'stockProductInput'));
    // Atribui um id para facilitar a seleção
    labelProduct.querySelector('input').id = 'stockProductInput';
    labelProduct.querySelector('input').value = name;
    form.appendChild(labelProduct);

    // Campo: Quantidade
    var labelQuantity = createLabeledInput('Quantidade:', createElementGeneric('input', 'stockQuantityInput'));
    labelQuantity.querySelector('input').id = 'stockQuantityInput';
    labelQuantity.querySelector('input').value = quantity;
    form.appendChild(labelQuantity);

    // Campo: Referência
    var labelReference = createLabeledInput('Referência:', createElementGeneric('input', 'stockReferenceInput'));
    labelReference.querySelector('input').id = 'stockReferenceInput';
    labelReference.querySelector('input').value = reference;
    form.appendChild(labelReference);

    // Container dos botões de ação
    var buttonsDiv = createElementGeneric('div', 'editStockButtonsDiv');
    var saveButton = createElementGeneric('button', 'saveStockButton', 'Guardar');
    var cancelButton = createElementGeneric('button', 'cancelStockButton', 'Cancelar');
    buttonsDiv.appendChild(saveButton);
    buttonsDiv.appendChild(cancelButton);
    form.appendChild(buttonsDiv);

    // Event listener para salvar
    saveButton.addEventListener('click', async function (event) {
        event.preventDefault();
        var productInput = document.getElementById('stockProductInput').value.trim();
        var quantityInput = document.getElementById('stockQuantityInput').value.trim();
        var referenceInput = document.getElementById('stockReferenceInput').value.trim();
        if (!productInput || !quantityInput || !referenceInput) {
            alert('Preencha todos os campos');
            return;
        }
        // Chama o endpoint de atualização de stock (PUT /stocks/:id)
        var stock = stocks[index];
        const result = await fetchJson(`/stocks/${stock.id}`, 'PUT', {
            name: productInput,
            quantity: quantityInput,
            reference: referenceInput
        });
        if (!result) {
            alert('Erro ao atualizar o stock');
            return;
        }
        checkForm();
        clearTableFromScreen();
        createStockSearchBar();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
    });

    // Event listener para cancelar
    cancelButton.addEventListener('click', async function () {
        checkForm();
        clearTableFromScreen();
        createStockSearchBar();
        document.documentElement.getElementsByTagName('main')[0].appendChild(await createStockTable());
    });

    div.appendChild(form);
    return div;
};
