-- Criar a base de dados (descomente se ainda não existir)
-- CREATE DATABASE ProjectHairdresser;

-- Usar a base de dados criada
USE ProjectHairdresser;

-- Remover as tabelas se já existirem
DROP TABLE IF EXISTS Client_Description;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Financial_Management;
DROP TABLE IF EXISTS Price_Table;
DROP TABLE IF EXISTS Stocks;

-- Criar a tabela do cliente
CREATE TABLE Client (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  age INT NOT NULL,
  email VARCHAR(50) ,
  address VARCHAR(50),
  nif VARCHAR(9) 
);

-- Criar tabela Employee
CREATE TABLE Employee (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Criar a tabela Client_Description
CREATE TABLE Client_Description (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idClient INT,
  appointmentDate DATETIME,
  description VARCHAR(255),
  technicalSheet VARCHAR(255),
  paymentMethod VARCHAR(50), 
  price FLOAT,
  employee_id INT NOT NULL,
  FOREIGN KEY (idClient) REFERENCES Client(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES Employee(id) ON DELETE CASCADE 
);

-- Criar a tabela Financial_Management
CREATE TABLE Financial_Management (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  address VARCHAR(50) NOT NULL,
  nif VARCHAR(9) UNIQUE NOT NULL
);

-- Criar a tabela Price_Table
CREATE TABLE Price_Table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  subtype VARCHAR(50) DEFAULT NULL,
  price FLOAT NOT NULL,
  -- A combinação de tipo e subtipo deve ser única; se não houver subtipo, o registo será único para o tipo
  UNIQUE KEY uk_type_subtype (type, subtype)
);

-- Criar a a tabela Stocks
CREATE TABLE Stocks (
	id INT AUTO_INCREMENT primary key,
    name VARCHAR(50) NOT NULL,
    reference VARCHAR(50),
    quantity INT NOT NULL
);

INSERT INTO Stocks (name, reference, quantity) VALUES 
('Pantene', 'B982UY19NX9102', 5);

-- Inserir clientes de teste
INSERT INTO Client (name, age, email, address, nif) VALUES
('João Silva', 30, 'joao.silva@gmail.com', 'Rua das Flores, 123', '123456789'),
('Maria Santos', 25, 'maria.santos@hotmail.com', 'Av. Liberdade, 45', '987654321'),
('Carlos Costa', 40, 'carlos.costa@yahoo.com', 'Rua do Sol, 78', '456123789'),
('Ana Ferreira', 35, 'ana.ferreira@gmail.com', 'Praça Central, 101', '741852963');

-- Inserir funcionários de teste
INSERT INTO Employee (name) VALUES
('Pedro Oliveira'),
('Sofia Martins'),
('Ricardo Gomes');

-- Inserir descrições para clientes teste
-- Supondo que os IDs dos clientes inseridos são 1, 2, 3, e 4 respectivamente.
INSERT INTO Client_Description (idClient, appointmentDate, description, technicalSheet, price, employee_id) VALUES
(1, '2025-02-10 12:00:00', 'Corte de cabelo e barba', 'cor verde 6', 25.00, 1),
(2, '2025-02-11 11:00:00', 'Coloração e tratamento capilar', 'cor vermelho 4', 40.00, 2),
(3, '2025-02-12 16:30:00', 'Corte de cabelo e lavagem', 'cor roxo 2', 20.00, 2),
(4, '2025-02-13 14:45:00', 'Manutenção de corte e barba', 'cor amarelo 1', 30.00, 1),
(1, '2025-03-01 17:15:00', 'Corte de cabelo', 'cor azul 10', 20.00, 1);

-- Inserir dados para a tabela Price_Table
INSERT INTO Price_Table (type, subtype, price) VALUES
('Cortes', 'Curto', 23.00),
('Cortes', 'Médio', 26.00),
('Cortes', 'Comprido', 29.00),

('Corte Homem', NULL, 13.00),

('Cortes de Criança', 'Curto', 18.00),
('Cortes de Criança', 'Médio', 20.00),
('Cortes de Criança', 'Comprido', 23.00),
('Cortes de Criança', 'Bébé', 10.00),

('Brushins', 'Curto', 10.00),
('Brushins', 'Médio', 13.00),
('Brushins', 'Comprido', 16.00),

('Côr', 'Curto', 25.00),
('Côr', 'Médio', 33.00),
('Côr', 'Comprido', 32.00),

('Côr Sem Amoniaco', 'Curto', 30.00),
('Côr Sem Amoniaco', 'Médio', 36.00),
('Côr Sem Amoniaco', 'Comprido', 38.00),

('Tom-Sobre-Tom', 'Curto', 23.00),
('Tom-Sobre-Tom', 'Médio', 28.00),
('Tom-Sobre-Tom', 'Comprido', 30.00),

('Matizar', 'Curto', 20.00),
('Matizar', 'Médio', 25.00),
('Matizar', 'Comprido', 30.00),

('Madeixas', 'Curto', 75.00),
('Madeixas', 'Médio', 80.00),
('Madeixas', 'Comprido', 90.00),

('Ondulação', 'Curto', 80.00),
('Ondulação', 'Médio', 85.00),
('Ondulação', 'Comprido', 90.00),

('Tratamento Capilar', 'Curto', 6.00),
('Tratamento Capilar', 'Médio', 8.00),
('Tratamento Capilar', 'Comprido', 10.00),

('Alisamento', 'Curto', 90.00),
('Alisamento', 'Médio', 145.00),
('Alisamento', 'Comprido', 170.00),

('Botox', 'Curto', 80.00),
('Botox', 'Médio', 135.00),
('Botox', 'Comprido', 160.00),

('Condicionador', NULL, 2.00),
('Shampoo', NULL, 2.00),
('Máscara', NULL, 4.00);


-- Para eliminar a base de dados (descomente se desejar)
-- DROP DATABASE ProjectHairdresser;