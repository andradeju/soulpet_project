// Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");

// Configuração do App
const app = express();
app.use(express.json()); // Possibilitar transitar dados usando JSON

// Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection); // efetivar a conexão
const Cliente = require("./database/cliente"); // Configurar o model da aplicação
const Endereco = require("./database/endereco");
const Pet = require("./database/pet");

// Definição de rotas
app.get("/clientes", async (req, res) => {
  //SELECT FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

//clientes/1,2
app.get("/clientes/:id", async (req, res) => {
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco],
  });
  if(cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ error: "Usuário não encontrado"});
  }
});

app.post("/clientes", async (req, res) => {
// Coletar os dados do req.body
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Dentro de 'novo' estará o objeto criado
    const novo = await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] } //Permite inserir cliente e endereço num comento
      );
    res.status(201).json(novo)
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu" })
  }
});

app.put("/clientes/:id", async (req, res) => {
    const { nome, email, telefone, endereco } = req.body;
    const { id } = req.params;

    try {
      const cliente = await Cliente.findOne({ where: { id }});
      if(cliente) {
        if(endereco){
          await Endereco.update(endereco, { where: { clienteId: id }});
        }
        await Cliente.update({ nome, email, telefone}, { where: { id }});
        res.status(200).json({ message: "Cliente editado com sucesso" })
      } else {
        res.status(404).json({ error: "Cliente não encontrado" })
      }

    } catch(err) {
      console.error(err)
      res.status(500).json({ error: "Um erro aconteceu"})
    }
});

//excluir um cliente
app.delete("/clientes/:id", async (req, res) => {
  //obter identificação do cliente pela rota
  const { id } = req.params;
  //buscar cliente por id
  const cliente = await Cliente.findOne({ where: { id }});
  try {
    if(cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente removido" })
    }
    else {
    res.status(404).json({ error: " Um erro aconteceu" })
  }
}
catch(err) {
  console.error(err);
  res.status(500).json({ error: "Um erro aconteceu" })
}
});

// Escuta de eventos (listen)
app.listen(3000, () => {
  // Gerar as tabelas a partir do model
  // Force = apaga tudo e recria as tabelas
  connection.sync({ force: true });
  console.log("Servidor rodando em http://localhost:3000/");
});
