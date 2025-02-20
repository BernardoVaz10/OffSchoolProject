-- Usar a base de dados criada
USE ProjectHairdresser;

-- Criar a a tabela Stocks
CREATE TABLE Stocks (
	id INT AUTO_INCREMENT primary key,
    name VARCHAR(50) NOT NULL,
    reference VARCHAR(50),
    quantity INT NOT NULL
);

INSERT INTO Stocks (name, reference, quantity) VALUES 
('Pantene', 'B982UY19NX9102', 5);

