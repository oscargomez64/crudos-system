CREATE DATABASE IF NOT EXISTS LaEspumaDorada;
USE LaEspumaDorada;

CREATE TABLE IF NOT EXISTS Cliente (
  IdCliente INT NOT NULL,
  Nombre VARCHAR(120) NOT NULL,
  RFC VARCHAR(20) NOT NULL,
  Ciudad VARCHAR(100) NOT NULL,
  TipoCliente ENUM('Mayorista', 'Minorista') NOT NULL,
  PRIMARY KEY (IdCliente),
  UNIQUE KEY uq_cliente_rfc (RFC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Cerveza (
  IdCerveza INT NOT NULL,
  Nombre VARCHAR(120) NOT NULL,
  Estilo VARCHAR(80) NOT NULL,
  GradoAlcohol DECIMAL(5,2) NOT NULL,
  PrecioLitro DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (IdCerveza)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Proveedor (
  IdProveedor INT NOT NULL,
  Nombre VARCHAR(120) NOT NULL,
  Telefono VARCHAR(30) NOT NULL,
  Ciudad VARCHAR(100) NOT NULL,
  PRIMARY KEY (IdProveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Ingrediente (
  IdIngrediente INT NOT NULL,
  Nombre VARCHAR(120) NOT NULL,
  UnidadMedida VARCHAR(30) NOT NULL,
  StockActual DECIMAL(12,3) NOT NULL DEFAULT 0,
  IdProveedor INT NOT NULL,
  PRIMARY KEY (IdIngrediente),
  KEY idx_ingrediente_proveedor (IdProveedor),
  CONSTRAINT fk_ingrediente_proveedor
    FOREIGN KEY (IdProveedor)
    REFERENCES Proveedor (IdProveedor)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Pedido (
  IdPedido INT NOT NULL,
  Fecha DATE NOT NULL,
  TotalVenta DECIMAL(12,2) NOT NULL DEFAULT 0,
  IdCliente INT NOT NULL,
  PRIMARY KEY (IdPedido),
  KEY idx_pedido_cliente (IdCliente),
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (IdCliente)
    REFERENCES Cliente (IdCliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Pedido_Cerveza (
  IdPedido INT NOT NULL,
  IdCerveza INT NOT NULL,
  CantidadLitros DECIMAL(12,3) NOT NULL,
  PrecioUnitarioAplicado DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (IdPedido, IdCerveza),
  CONSTRAINT fk_pedido_cerveza_pedido
    FOREIGN KEY (IdPedido)
    REFERENCES Pedido (IdPedido)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_pedido_cerveza_cerveza
    FOREIGN KEY (IdCerveza)
    REFERENCES Cerveza (IdCerveza)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Cerveza_Ingrediente (
  IdCerveza INT NOT NULL,
  IdIngrediente INT NOT NULL,
  CantidadRequerida DECIMAL(12,3) NOT NULL,
  PRIMARY KEY (IdCerveza, IdIngrediente),
  CONSTRAINT fk_cerveza_ingrediente_cerveza
    FOREIGN KEY (IdCerveza)
    REFERENCES Cerveza (IdCerveza)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_cerveza_ingrediente_ingrediente
    FOREIGN KEY (IdIngrediente)
    REFERENCES Ingrediente (IdIngrediente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
