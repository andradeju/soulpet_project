// Modelo para gerar a tabela de clientes no MySQL
// Mapeamento: cada propriedade vira uma coluna da tabela

// DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Cliente = connection.define("cliente", {
  // Configurar a coluna 'nome'
  nome: {
    // nome VARCHAR NOT NULL
    type: DataTypes.STRING(130),
    allowNull: false, // NOT NULL
  },
  email: {
    // email VARCHAR UNIQUE NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    // telefone VARCHAR NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//Associação 1:1
const Endereco = require("./endereco");

//Cliente tem um Endereço
//Endereço ganha uma FK (nome do model + Id)
//FK = clienteId
Cliente.hasOne(Endereco); 
Endereco.belongsTo(Cliente); //Endereço pertence a um Cliente

module.exports = Cliente;
