
/**
 * Class Employee
 * 
 * @param {number} id
 * @param {string} name
 * 
 */
class Employee {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }
}

// ********** Functions for Adding, Removing, and Fetching Employees **********
/**
 * Add Employees to the database
 * 
 * @param {string} name
 * 
 */
Employee.addEmployee = async function (name) {
    const result = await fetchJson('/employees', 'POST', {
        name
    });
    if (!result) throw new Error('Failed to add Employee');
    employees.push(new Employee(result.id, name));
}

/**
 * Remove Employee from the database
 *  
 * @param {number} id
 *  
 */
Employee.removeEmployee = async function (id) {
    const result = await fetchJson(`/employees/${id}`, 'DELETE');
    if (!result) throw new Error('Failed to remove Employee');
    employees = employees.filter((employee) => employee.getId() !== id);
}

/**
 * Get Employee from the database
 *  
 * @param {number} id
 */
Employee.getEmployeeById = async function (id) {
    const result = await fetchJson(`/employees/${id}`, 'GET');
    if (!result) throw new Error('Failed to load Employee');
    employees = new Employee(result[0].id, result[0].name);
}

/**
 * Update Employee from the database
 *  
 * @param {number} id
 * @param {string} name
 */
Employee.updateEmployee = async function (id, name) {
    const result = await fetchJson(`/employees/${id}`, 'PUT', {
        name
    });
    if (!result) throw new Error('Failed to update Employee');
    const index = employees.findIndex((type) => type.getId() === id);
    employees[index] = new Employee(id, name);
}


/**
 * @function createManagerTable
 * 
 * @description Function to create/show the manager table, that contains the employees
 * 
 */
var createManagerTable = async function () {
    const data = await fetchJson('employees');
    employees = data.map(employee => new Employee(employee.id, employee.name));
    const div = createElementGeneric('div', 'employeesDiv');
    const tableTitle = createElementGeneric('h2', 'table-title', 'Tabela de Funcionários');
    const table = createElementGeneric('table', 'employees-table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    let th = document.createElement('th');
    th.textContent = 'Nome';
    tr.appendChild(th);
    thead.appendChild(tr);
    table.appendChild(thead);
  
    const tbody = createElementGeneric('tbody', 'employeesTableBody');
    for (var i = 0; i < employees.length; i++) {
      const tr = document.createElement('tr');
      tr.setAttribute('index', i);
      tr.addEventListener('click', function (event) {
        selectRow(event);
      });
      let td = document.createElement('td');
      td.textContent = employees[i].getName();
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    div.appendChild(tableTitle);
    div.appendChild(table);
    div.appendChild(createManagerTableButtons());
    document.documentElement.getElementsByTagName('main')[0].appendChild(div);
  }
  
  /**
   * @function createManagerTableButtons
   *  
   * @description Function to create the buttons to manager table
   *  
   * @returns {element} buttonsDiv
   */
  var createManagerTableButtons = function () {
    var buttonsDiv = createElementGeneric('div', 'buttonsDiv');
    buttonsDiv.appendChild(createElementGeneric('button', 'createEmployeeButton', 'Adicionar Funcionário'));
    buttonsDiv.appendChild(createElementGeneric('button', 'deleteEmployeeButton', 'Remover Funcionário'));
    var createEmployeeButton = buttonsDiv.querySelector('.createEmployeeButton');
    var deleteEmployeeButton = buttonsDiv.querySelector('.deleteEmployeeButton');
    deleteEmployeeButton.disabled = true;
    createEmployeeButton.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      document.documentElement.getElementsByTagName('main')[0].appendChild(showCreateEmployeeForm());
    });
    deleteEmployeeButton.addEventListener('click', async function () {
      if (selectedRow) {
        checkForm();
        const employeeId = employees[selectedRow].getId();
        await fetchJson(`/employees/${employeeId}`, 'DELETE');
        clearTableFromScreen();
        createManagerTable();
      }
    });
    return buttonsDiv;
  }
  
  /**
   * @function showCreateEmployeeForm
   *  
   * @description Function to show the form to create an employee
   *  
   * @returns {element} form
   */
  var showCreateEmployeeForm = function () {
    var form = createElementGeneric('form', 'employeeForm');
    var labelName = createElementGeneric('label', 'employeeNameLabel');
    labelName.textContent = 'Nome: ';
    form.appendChild(labelName);
    var inputName = createElementGeneric('input', 'employeeName');
    inputName.type = 'text';
    inputName.required = true;
    form.appendChild(inputName);
  
    var buttonsDiv = createElementGeneric('div', 'employeeButtons');
  
    var saveButton = createElementGeneric('button', 'saveEmployeeButton', 'Adicionar');
    buttonsDiv.appendChild(saveButton);
  
    var cancelButton = createElementGeneric('button', 'cancelEmployeeButton', 'Cancelar');
    buttonsDiv.appendChild(cancelButton);
  
    saveButton.addEventListener('click', async function (event) {
      event.preventDefault();
      let name = inputName.value.trim();
      if (!name) {
        alert('Preencha o nome do funcionário');
        return;
      };
      await fetchJson('/employees', 'POST', {
        name
      });
      checkForm();
      clearTableFromScreen();
      createManagerTable();
    });
  
    cancelButton.addEventListener('click', function () {
      checkForm();
      clearTableFromScreen();
      createManagerTable();
      return;
    });
  
    form.appendChild(buttonsDiv);
  
    return form;
  }