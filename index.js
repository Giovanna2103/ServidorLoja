const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

// configuração do cors para aceitar varios protocolos de requisição
const configCors = {
    origin:"*",
    opitionSuccessStatus:200
}


// configuração da comunicação com o banco de dados mongoDB
mongoose.connect("mongodb+srv://passarinho:gigi2103@bancoapi.brtr3.mongodb.net/lojaDB?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true});

// construção da tabela Produtos
const tbproduto = mongoose.Schema({
    nomeproduto: String,
    descricao: String,
    quantidade: Number,
    preco: String,
    foto: String
});

// contrução do modelo de tabela no momgoDB
const Produto = mongoose.model ("produto", tbproduto);


// construção da estrutura da tabela carrinho
const tbcarrinho = mongoose.Schema({
    idproduto: String,
    nomeproduto: String,
    preco: String,
    foto: String
});

// criação da tabela carrinho
const Carrinho = mongoose.model ("carrinho", tbproduto);

//Construção da estrutura da tabela usuario
const tbusuario = mongoose.Schema({
    nomeusuario:String,
    senha:String,
    nomecompleto:String,
    email:String
});

//Criação do modelo de dados, ou seja, a criação da tabela 
//efetivamente.
const Usuario = mongoose.model("usuario",tbusuario);



// criação dos endpoints para o modelo produto

// iniciando com a rota para CADASTRO, usando o verbo POST (postar os dados dos Produtos)

app.post ("/produto/cadastro", cors(configCors), (req,res) => {
    const dados = new Produto (req.body);
    dados.save().then(() => {
        res.status(201).send({rs:"Produto Cadastrado"});
    }) .catch((erro) => console.error (`Erro ao tentar cadastrar ${erro}`));
});


app.put ("/produto/atualizar/:id", cors(configCors), (req,res) => {
    Produto.findByIdAndUpdate(req.params.id, req.body, (erro,dados) => {
        if(erro){
            res.status(400).send({rs:`Erro ao tentar atualizar ${erro}`});
            return;
        }
        res.status(200).send({rs:"Produto atualizado."});
    });
});


app.delete ("/produto/deletar/:id", cors(configCors), (req,res) => {
    Produto.findByIdAndDelete(req.params.id, req.body, (erro,dados) => {
        if(erro){
            res.status(400).send({rs:`Erro ao tentar deletar ${erro}`});
            return;
        }
        res.status(200).send({rs:"Produto Deletado."});
    });
});


app.get ("/produto/listar", cors(configCors), (req,res) => {
    Produto.find((erro,dados) => {
        if(erro){
            res.status(400).send({rs:`Ocorreu um erro ao tentar lista ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});


app.get ("/produto/codproduto/:id", cors(configCors), (req,res) => {
    Produto.findById(req.params.id, (erro,dados) => {
        if(erro){
            res.status(400).send({rs:`Erro ao tentar consultar esse produto ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});


app.get ("/produto/nomeproduto/:nome", cors(configCors), (req,res) => { 
    Produto.find({nomeproduto:req.params.nome}, (erro,dados) => {
        if(erro){
            res.status(400).send({rs:`Erro ao tentar consultar esse produto ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});


// ------------------ CRIAÇÃO DAS ROTAR PARA O CARRINHO -----------------------------

app.post ("/carrinho/adicionar", cors(configCors), (req,res) => {
    const dados = new Carrinho(req.body);
    dados.save().then(() => {
        res.status(201).send({rs: "Item Adicionado"});    
    }).catch((error) => console.error (`Erro ao tentar adicionar o item ao carrinho ${error}`));
});

app.get ("/carrinho/itens", cors(configCors), (req,res) => {
    Carrinho.find((error,dados) => {
        if(error){
            res.status(400).send({rs:`Erro ao tentar listar os itens no carrinho ${error}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});

app.delete ("/carrinho/removeritem/:id", cors(configCors), (req,res) => {
    Carrinho.findByIdAndDelete(req.params.id, req.body, (error,dados) => {
        if(error){
            res.status(400).send({rs:`Erro ao tentar deletar ${error}`});
            return;
        }
        res.status(204).send({rs:"Item removido"});
    });
});

//----------------------------- Criação das rotas para o usuário ---------------------

app.post("/usuario/cadastro",cors(configCors),(req,res)=>{
    const dados = new Usuario(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:`Cadastro efetuado com sucesso`});
    }).catch((error)=>res.status(400).send({rs:`Erro ao tentar cadastrar ${error}`}));
});

app.post("/usuario/login",cors(configCors),(req,res)=>{
    const us = req.body.nomeusuario;
    const sh = req.body.senha;
    Usuario.find({nomeusuario:us,senha:sh},(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar executar a consulta ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});

app.put("/usuario/atualizar/:id",cors(configCors),(req,res)=>{
    Usuario.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar atualizar ${erro}`});
            return;
        }
        res.status(200).send({rs:`Dados atualizados`});
    })
});










app.listen("5000", () => console.log("Servidor Ondeline na porta 5000"));

