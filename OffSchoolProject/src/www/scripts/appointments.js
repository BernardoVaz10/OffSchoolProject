"use strict";

/**
 * @function createTodayAppointmentsTable
 * 
 * @description Function to create the table to show today appointments
 * 
 */
var createTodayAppointmentsTable = async function () {
    const div = createElementGeneric('div', 'todayAppointmentsDiv');
    const table = createElementGeneric('table', 'todayAppointmentsTable');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    const thClient = document.createElement('th');
    thClient.textContent = 'Cliente';
    headerRow.appendChild(thClient);
  
    const thTime = document.createElement('th');
    thTime.textContent = 'Horário';
    headerRow.appendChild(thTime);
  
    const thEmployee = document.createElement('th');
    thEmployee.textContent = 'Funcionário';
    headerRow.appendChild(thEmployee);
  
    const thPrice = document.createElement('th');
    thPrice.textContent = 'Preço';
    headerRow.appendChild(thPrice);
  
    const thDescription = document.createElement('th');
    thDescription.textContent = 'Serviço';
    headerRow.appendChild(thDescription);
  
    const thTechnical = document.createElement('th');
    thTechnical.textContent = 'Ficha Técnica';
    headerRow.appendChild(thTechnical);
  
    const thPaymentMethod = document.createElement('th');
    thPaymentMethod.textContent = 'Método de Pagamento';
    headerRow.appendChild(thPaymentMethod);
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = createElementGeneric('tbody', 'todayAppointmentsTableBody');
    let countPrice = 0;
    try {
      const data = await fetchJson('employees');
      employees = data.map(employee => new Employee(employee.id, employee.name));
  
      const headers = ['Cliente', 'Horário', 'Funcionário', 'Preço', 'Serviço', 'Ficha Técnica', 'Método de Pagamento'];
  
      const clientsData = await fetchJson('clients');
      const clients = clientsData.map(client => new Client(client.id, client.name));
  
      const appointmentsData = await fetchJson('/appointments/today');
      if (!appointmentsData.length) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = headers.length;
        noDataCell.textContent = 'Sem marcações para hoje.';
        noDataCell.style.textAlign = 'center';
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
      } else {
        appointmentsData.forEach(appointment => {
          const tr = document.createElement('tr');
          const tdClient = document.createElement('td');
          const client = clients.find(client => client.getId() === appointment.idClient);
          tdClient.textContent = client ? client.getName() : 'N/A';
          tr.appendChild(tdClient);
          const time = new Date(appointment.appointmentDate).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          const tdTime = document.createElement('td');
          tdTime.textContent = time;
          tr.appendChild(tdTime);
  
          let tdEmployee = document.createElement('td');
          if (employees && employees.length > 0) {
            const employee = employees.find(emp => emp.getId() === appointment.employee_id);
            tdEmployee.textContent = employee ? employee.getName() : 'N/A';
          }
          tr.appendChild(tdEmployee);
  
          const tdPrice = document.createElement('td');
          tdPrice.textContent = appointment.price !== undefined ? appointment.price + '€' : 'N/A';
          countPrice += appointment.price;
          tr.appendChild(tdPrice);
  
          const tdDescription = document.createElement('td');
          tdDescription.textContent = appointment.description;
          tr.appendChild(tdDescription);
  
          const tdTechnical = document.createElement('td');
          tdTechnical.textContent = appointment.technicalSheet || 'N/A';
          tr.appendChild(tdTechnical);
  
          const tdPaymentMethod = document.createElement('td');
          const selectPaymentMethod = document.createElement('select');
          const paymentMethods = [' ', 'Dinheiro', 'Transferência', 'MBWay'];
          paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method;
            if (method === appointment.paymentMethod) {
              option.selected = true;
            }
            selectPaymentMethod.appendChild(option);
          });
          selectPaymentMethod.onchange = async function () {
            await Client_Description.updateClientPaymentMethod(appointment.id, selectPaymentMethod.value);
          };
          tdPaymentMethod.appendChild(selectPaymentMethod);
          tr.appendChild(tdPaymentMethod);
  
          tbody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error("Erro ao carregar marcações do dia:", err);
      const tr = document.createElement('tr');
      const tdError = document.createElement('td');
      tdError.textContent = "Erro ao carregar dados.";
      tdError.colSpan = 4;
      tr.appendChild(tdError);
      tbody.appendChild(tr);
    }
  
    const tableTitle = createElementGeneric('h2', 'todayAppointmentsTitle', `Marcações do dia - Total do dia: ${countPrice}€`);
    div.appendChild(tableTitle);
    table.appendChild(tbody);
    div.appendChild(table);
    return div;
  };
  
  /**
   * @function createTomorrowAppointmentsTable
   * 
   * @description Function to create the table to show tomorrow appointments
   * 
   */
  var createTomorrowAppointmentsTable = async function () {
    const div = createElementGeneric('div', 'tomorrowAppointmentsDiv');
    const headers = ['Cliente', 'Horário', 'Funcionário', 'Preço', 'Serviço', 'Ficha Técnica', 'Método de Pagamento'];
  
    const table = createElementGeneric('table', 'tomorrowAppointmentsTable');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    const thClient = document.createElement('th');
    thClient.textContent = 'Cliente';
    headerRow.appendChild(thClient);
  
    const thTime = document.createElement('th');
    thTime.textContent = 'Horário';
    headerRow.appendChild(thTime);
  
    const thEmployee = document.createElement('th');
    thEmployee.textContent = 'Funcionário';
    headerRow.appendChild(thEmployee);
  
    const thPrice = document.createElement('th');
    thPrice.textContent = 'Preço';
    headerRow.appendChild(thPrice);
  
    const thDescription = document.createElement('th');
    thDescription.textContent = 'Serviço';
    headerRow.appendChild(thDescription);
  
    const thTechnical = document.createElement('th');
    thTechnical.textContent = 'Ficha Técnica';
    headerRow.appendChild(thTechnical);
  
    const thPaymentMethod = document.createElement('th');
    thPaymentMethod.textContent = 'Método de Pagamento';
    headerRow.appendChild(thPaymentMethod);
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = createElementGeneric('tbody', 'tomorrowAppointmentsTableBody');
    let countPrice = 0;
    try {
      const appointmentsData = await fetchJson('/appointments/tomorrow');
      if (!appointmentsData.length) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = headers.length;
        noDataCell.textContent = 'Sem marcações para amanhã.';
        noDataCell.style.textAlign = 'center';
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
      } else {
        const clientsData = await fetchJson('clients');
        const clients = clientsData.map(client => new Client(client.id, client.name));
        appointmentsData.forEach(appointment => {
          const tr = document.createElement('tr');
          const tdClient = document.createElement('td');
          const client = clients.find(c => c.getId() === appointment.idClient);
          tdClient.textContent = client ? client.getName() : 'N/A';
          tr.appendChild(tdClient);
  
          const tdTime = document.createElement('td');
          const time = new Date(appointment.appointmentDate).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          tdTime.textContent = time;
          tr.appendChild(tdTime);
  
          const tdEmployee = document.createElement('td');
          let employee;
          if (employees && employees.length > 0) {
            employee = employees.find(emp => emp.getId() === appointment.employee_id);
          }
          tdEmployee.textContent = employee ? employee.getName() : 'N/A';
          tr.appendChild(tdEmployee);
  
          const tdPrice = document.createElement('td');
          tdPrice.textContent = (appointment.price !== undefined ? appointment.price + '€' : 'N/A');
          countPrice += appointment.price;
          tr.appendChild(tdPrice);
  
          const tdDescription = document.createElement('td');
          tdDescription.textContent = appointment.description;
          tr.appendChild(tdDescription);
  
          const tdTechnical = document.createElement('td');
          tdTechnical.textContent = appointment.technicalSheet || 'N/A';
          tr.appendChild(tdTechnical);
  
          const tdPaymentMethod = document.createElement('td');
          const selectPaymentMethod = document.createElement('select');
          const paymentMethods = [' ', 'Dinheiro', 'Transferência', 'MBWay'];
          paymentMethods.forEach(method => {
            const option = document.createElement('option');
            option.value = method;
            option.textContent = method;
            if (method === appointment.paymentMethod) {
              option.selected = true;
            }
            selectPaymentMethod.appendChild(option);
          });
          selectPaymentMethod.onchange = async function () {
            await Client_Description.updateClientPaymentMethod(appointment.id, selectPaymentMethod.value);
          };
          tdPaymentMethod.appendChild(selectPaymentMethod);
          tr.appendChild(tdPaymentMethod);
  
          tbody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error("Erro ao carregar marcações de amanhã:", err);
      const errorRow = document.createElement('tr');
      const errorCell = document.createElement('td');
      errorCell.colSpan = headers.length;
      errorCell.textContent = "Erro ao carregar dados.";
      errorRow.appendChild(errorCell);
      tbody.appendChild(errorRow);
    }
  
    const tableTitle = createElementGeneric('h2', 'tomorrowAppointmentsTitle', `Marcações de Amanhã - Total do dia: ${countPrice}€`);
    div.appendChild(tableTitle);
    table.appendChild(tbody);
    div.appendChild(table);
  
    return div;
  };

  /**
 * @function showCreateAppointmentForm
 * 
 * @description Function to show the form to create an appointment with multiple services
 */
var showCreateAppointmentForm = async function () {
    var div = createElementGeneric('div', 'createAppointmentDiv');
    var form = createElementGeneric('form', 'appointmentForm');
  
    var labelAppointmentDate = createElementGeneric('label', 'appointmentDateLabel');
    labelAppointmentDate.textContent = 'Data da Marcação: ';
    form.appendChild(labelAppointmentDate);
    var inputAppointmentDate = createElementGeneric('input', 'appointmentDate');
    inputAppointmentDate.type = 'datetime-local';
    inputAppointmentDate.required = true;
    form.appendChild(inputAppointmentDate);
  
    var labelPrice = createElementGeneric('label', 'appointmentPriceLabel');
    labelPrice.textContent = 'Preço Total: ';
    form.appendChild(labelPrice);
    var inputPrice = createElementGeneric('input', 'appointmentPrice');
    inputPrice.type = 'number';
    inputPrice.required = true;
    inputPrice.readOnly = true;
    inputPrice.placeholder = '0€';
    form.appendChild(inputPrice);
  
    var labelEmployee = createElementGeneric('label', 'appointmentEmployeeLabel');
    labelEmployee.textContent = 'Funcionário: ';
    form.appendChild(labelEmployee);
    var selectEmployee = createElementGeneric('select', 'appointmentEmployee');
    selectEmployee.required = true;
    const dataEmployees = await fetchJson('employees');
    employees = dataEmployees.map(employee => new Employee(employee.id, employee.name));
    for (var i = 0; i < employees.length; i++) {
      var optionEmp = document.createElement('option');
      optionEmp.value = employees[i].getId();
      optionEmp.textContent = employees[i].getName();
      selectEmployee.appendChild(optionEmp);
    }
    form.appendChild(selectEmployee);
  
    var servicesContainer = createElementGeneric('div', 'servicesContainer');
    form.appendChild(servicesContainer);
  
    var labelTechnicalSheet = createElementGeneric('label', 'appointmentTechnicalSheetLabel', 'Ficha Técnica: ');
    form.appendChild(labelTechnicalSheet);
    var inputTechnicalSheet = createElementGeneric('textarea', 'appointmentTechnicalSheet');
    inputTechnicalSheet.required = false;
    form.appendChild(inputTechnicalSheet);
  
    var addServiceButton = createElementGeneric('button', 'addServiceButton', 'Adicionar Serviço');
    addServiceButton.type = 'button';
    form.appendChild(addServiceButton);
  
    const priceData = await fetchJson('price_table');
  
    function addServiceFields() {
      var serviceDiv = createElementGeneric('div', 'serviceDiv');
  
      var labelType = createElementGeneric('label', 'appointmentTypeLabel');
      labelType.textContent = 'Tipo: ';
      serviceDiv.appendChild(labelType);
      var selectType = createElementGeneric('select', 'appointmentType');
      var defaultOption = document.createElement('option');
      defaultOption.value = "";
      defaultOption.textContent = "Sem tipo";
      selectType.required = true;
      selectType.appendChild(defaultOption);
      serviceDiv.appendChild(selectType);
  
      var labelSubtype = createElementGeneric('label', 'appointmentSubtypeLabel');
      labelSubtype.textContent = 'Subtipo: ';
      serviceDiv.appendChild(labelSubtype);
      var selectSubtype = createElementGeneric('select', 'appointmentSubtype');
      var defaultOption = document.createElement('option');
      defaultOption.value = "";
      defaultOption.textContent = "Sem subtipo";
      selectSubtype.appendChild(defaultOption);
      serviceDiv.appendChild(selectSubtype);
  
      var removeServiceButton = createElementGeneric('button', 'removeServiceButton', 'Remover');
      removeServiceButton.type = 'button';
      removeServiceButton.addEventListener('click', function () {
        serviceDiv.remove();
        updateTotalPrice();
      });
      serviceDiv.appendChild(removeServiceButton);
  
      const types = [...new Set(priceData.map(item => item.type))];
      types.forEach(type => {
        var optionType = document.createElement('option');
        optionType.value = type;
        optionType.textContent = type;
        selectType.appendChild(optionType);
      });
  
      selectType.addEventListener('change', () => updateSubtypes(selectType, selectSubtype));
      selectSubtype.addEventListener('change', updateTotalPrice);
      selectType.addEventListener('change', updateTotalPrice);
      servicesContainer.appendChild(serviceDiv);
    }
  
    addServiceButton.addEventListener('click', addServiceFields);
  
    function updateSubtypes(selectType, selectSubtype) {
      while (selectSubtype.options.length > 1) {
        selectSubtype.remove(1);
      }
      const selectedType = selectType.value;
      const subtypes = priceData.filter(item => item.type === selectedType && item.subtype)
        .map(item => item.subtype);
      const uniqueSubtypes = [...new Set(subtypes)];
      uniqueSubtypes.forEach(subtype => {
        var optionSubtype = document.createElement('option');
        optionSubtype.value = subtype;
        optionSubtype.textContent = subtype;
        selectSubtype.appendChild(optionSubtype);
      });
    }
  
    function updateTotalPrice() {
      let total = 0;
      const serviceDivs = servicesContainer.querySelectorAll('.serviceDiv');
      serviceDivs.forEach(serviceDiv => {
        const selectType = serviceDiv.querySelector('.appointmentType');
        const selectSubtype = serviceDiv.querySelector('.appointmentSubtype');
        const selectedType = selectType.value;
        const selectedSubtype = selectSubtype.value;
  
        let priceObj = priceData.find(item => item.type === selectedType && item.subtype === selectedSubtype);
        if (!priceObj) {
          priceObj = priceData.find(item => item.type === selectedType && (!item.subtype || item.subtype === ""));
        }
  
        if (priceObj) {
          total += priceObj.price;
        }
      });
      inputPrice.value = total;
    }
  
    var saveButton = createElementGeneric('button', 'createAppointmentButton', 'Adicionar');
    form.appendChild(saveButton);
  
    var cancelButton = createElementGeneric('button', 'cancelAppointmentButton', 'Cancelar');
    form.appendChild(cancelButton);
  
    saveButton.addEventListener('click', async function (event) {
      event.preventDefault();
      let appointmentDate = inputAppointmentDate.value;
      let price = inputPrice.value;
      let employeeId = selectEmployee.value;
      let technicalSheet = inputTechnicalSheet.value.trim();
  
      if (!appointmentDate || !price || !employeeId) {
        alert('Preencha os campos obrigatórios (Data de marcação, Serviço prestado e Funcionário)');
        return;
      } else if (new Date(appointmentDate) < new Date()) {
        alert('Data da Marcação inválida');
        return;
      } else if (price < 0) {
        alert('Preço inválido');
        return;
      }
  
      const servicesDescriptions = Array.from(servicesContainer.querySelectorAll('.serviceDiv')).map(serviceDiv => {
        const type = serviceDiv.querySelector('.appointmentType').value;
        const subtype = serviceDiv.querySelector('.appointmentSubtype').value;
        return subtype ? `${type} - ${subtype}` : type;
      }).join(' + ');
  
      await Client_Description.addClientDescription(client.id, servicesDescriptions, appointmentDate, Number(price), Number(employeeId), technicalSheet);
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric('div', 'mainContainer');
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.id));
      document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
    });
  
    cancelButton.addEventListener('click', async function () {
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric('div', 'mainContainer');
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.getId()));
      document.documentElement.getElementsByTagName('main')[0].appendChild(mainContainer);
      return;
    });
  
    div.appendChild(form);
    return div;
  }

  /**
 * @function showEditClientForm
 * 
 * @description Function to show the form to edit a client
 */
var showEditAppointmentForm = async function (appointment, appointmentId) {
    const div = createElementGeneric("div", "editAppointmentDiv");
    const h2 = createElementGeneric("h2", "editAppointmentTitle", "Editar Marcação");
    div.appendChild(h2);
  
    const dateInput = createElementGeneric("input", "editDate");
    dateInput.type = "datetime-local";
    dateInput.value = appointment.appointmentDate ?
      appointment.appointmentDate.slice(0, 16) :
      "";
    div.appendChild(createLabeledInput("Data da Marcação:", dateInput));
  
    const priceInput = createElementGeneric("input", "editPrice");
    priceInput.type = "number";
    priceInput.readOnly = true;
    priceInput.value = appointment.price;
    div.appendChild(createLabeledInput("Preço:", priceInput));
  
    const labelTechnicalSheet = createElementGeneric(
      "label",
      "appointmentTechnicalSheetLabel",
      "Ficha Técnica: "
    );
    div.appendChild(labelTechnicalSheet);
    const technicalSheetInput = createElementGeneric(
      "textarea",
      "appointmentTechnicalSheet"
    );
    technicalSheetInput.required = false;
  
    technicalSheetInput.value = appointment.technicalSheet;
    div.appendChild(technicalSheetInput);
  
    const employeeSelect = createElementGeneric("select", "editEmployee");
    const dataEmployees = await fetchJson("employees");
    const employees = dataEmployees.map(
      (employee) => new Employee(employee.id, employee.name)
    );
    employees.forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee.getId();
      option.textContent = employee.getName();
      if (employee.getId() === appointment.employee_id) {
        option.selected = true;
      }
      employeeSelect.appendChild(option);
    });
    div.appendChild(createLabeledInput("Funcionário:", employeeSelect));
  
    const priceData = await fetchJson("price_table");
  
    const servicesContainer = createElementGeneric("div", "editServicesContainer");
    div.appendChild(servicesContainer);
  
    function addServiceFields(type = "", subtype = "") {
      const serviceDiv = createElementGeneric("div", "serviceDiv");
      const typeLabel = createElementGeneric(
        "label",
        "editAppointmentTypeLabel",
        "Tipo: "
      );
      serviceDiv.appendChild(typeLabel);
      const selectType = createElementGeneric("select", "editAppointmentType");
      selectType.required = true;
      const types = [...new Set(priceData.map((item) => item.type))];
      if (!type && types.length > 0) {
        type = types[0];
      }
      types.forEach((typeOption) => {
        const option = document.createElement("option");
        option.value = typeOption;
        option.textContent = typeOption;
        if (typeOption === type) {
          option.selected = true;
        }
        selectType.appendChild(option);
      });
      serviceDiv.appendChild(selectType);
  
      const subtypeLabel = createElementGeneric(
        "label",
        "editAppointmentSubtypeLabel",
        "Subtipo: "
      );
      serviceDiv.appendChild(subtypeLabel);
      const selectSubtype = createElementGeneric("select", "editAppointmentSubtype");
  
      function updateSubtypes() {
        selectSubtype.innerHTML = "";
        const defaultSubtypeOption = document.createElement("option");
        defaultSubtypeOption.value = "";
        defaultSubtypeOption.textContent = "Sem subtipo";
        selectSubtype.appendChild(defaultSubtypeOption);
  
        const selectedType = selectType.value;
        const subtypes = priceData
          .filter((item) => item.type === selectedType && item.subtype)
          .map((item) => item.subtype);
        const uniqueSubtypes = [...new Set(subtypes)];
        if (!subtype && uniqueSubtypes.length > 0) {
          subtype = uniqueSubtypes[0];
        }
        uniqueSubtypes.forEach((subtypeOption) => {
          const option = document.createElement("option");
          option.value = subtypeOption;
          option.textContent = subtypeOption;
          if (subtypeOption === subtype) {
            option.selected = true;
          }
          selectSubtype.appendChild(option);
        });
      }
  
      selectType.addEventListener("change", () => {
        updateSubtypes();
        updateTotalPrice();
      });
      selectSubtype.addEventListener("change", updateTotalPrice);
  
      updateSubtypes();
      serviceDiv.appendChild(selectSubtype);
  
      const removeServiceButton = createElementGeneric(
        "button",
        "removeServiceButton",
        "Remover"
      );
      removeServiceButton.type = "button";
      removeServiceButton.addEventListener("click", function () {
        serviceDiv.remove();
        updateTotalPrice();
      });
      serviceDiv.appendChild(removeServiceButton);
  
      servicesContainer.appendChild(serviceDiv);
    }
  
    if (appointment.description) {
      const servicesDescriptions = appointment.description.split(" + ");
      servicesDescriptions.forEach((service) => {
        const [dbType, dbSubtype] = service.includes(" - ") ?
          service.split(" - ") : [service, ""];
        addServiceFields(dbType.trim(), dbSubtype.trim());
      });
    } else {
      addServiceFields();
    }
  
    const addServiceButton = createElementGeneric("button", "addServiceButton", "Adicionar Serviço");
    addServiceButton.type = "button";
    addServiceButton.addEventListener("click", function () {
      addServiceFields();
      updateTotalPrice();
    });
    div.appendChild(addServiceButton);
  
    function updateTotalPrice() {
      let total = 0;
      const serviceDivs = servicesContainer.querySelectorAll(".serviceDiv");
      serviceDivs.forEach((serviceDiv) => {
        const selectType = serviceDiv.querySelector(".editAppointmentType");
        const selectSubtype = serviceDiv.querySelector(".editAppointmentSubtype");
        const selectedType = selectType.value;
        const selectedSubtype = selectSubtype.value;
  
        let priceObj = priceData.find(
          (item) =>
          item.type === selectedType && item.subtype === selectedSubtype
        );
        if (!priceObj) {
          priceObj = priceData.find(
            (item) => item.type === selectedType && (!item.subtype || item.subtype === "")
          );
        }
        if (priceObj) {
          total += priceObj.price;
        }
      });
      priceInput.value = total;
    }
  
    updateTotalPrice();
  
    const divButtons = createElementGeneric("div", "editAppointmentButtons");
    const saveButton = createElementGeneric("button", "saveAppointment", "Guardar");
    const cancelButton = createElementGeneric("button", "cancelAppointment", "Cancelar");
    divButtons.appendChild(saveButton);
    divButtons.appendChild(cancelButton);
    div.appendChild(divButtons);
  
    saveButton.addEventListener("click", async function () {
      if (!dateInput.value || !priceInput.value || !employeeSelect.value) {
        alert("Preencha os campos obrigatórios (Data de marcação, Serviço prestado e Funcionário)");
        return;
      }
  
      const newDescriptions = Array.from(
          servicesContainer.querySelectorAll(".serviceDiv")
        )
        .map((serviceDiv) => {
          const type = serviceDiv.querySelector(".editAppointmentType").value;
          const subtype = serviceDiv.querySelector(".editAppointmentSubtype").value;
          return subtype ? `${type} - ${subtype}` : type;
        })
        .join(" + ");

        if (!dateInput.value || !priceInput.value || !employeeSelect.value || !newDescriptions) {
          alert("Preencha todos os campos");
          return;
        }
  
      await Client_Description.updateClientDescription(
        client.getId(),
        appointmentId,
        dateInput.value,
        priceInput.value,
        newDescriptions,
        technicalSheetInput.value,
        employeeSelect.value
      );
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric("div", "mainContainer");
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.getId()));
      document.documentElement.getElementsByTagName("main")[0].appendChild(mainContainer);
    });
  
    cancelButton.addEventListener("click", async function () {
      checkForm();
      clearTableFromScreen();
      const mainContainer = createElementGeneric("div", "mainContainer");
      mainContainer.appendChild(showDetailsClient());
      mainContainer.appendChild(await createDescriptionTable(client.getId()));
      document.documentElement.getElementsByTagName("main")[0].appendChild(mainContainer);
      return;
    });
  
    return div;
  };