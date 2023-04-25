const express = require ('express')
let apiRouter = express.Router()

//Processa corpo em formato JSON
apiRouter.use (express.json())

const endpoint = '/'
const db_produtos = {
    produtos: [
    { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João" },
    { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans" },
    { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé" },
    { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps" },
    { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé" },
    ]
}

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    }
});

apiRouter.get (endpoint + 'produtos', (req, res) => {
    res.status(200).json ({ data : db_produtos.produtos })
})

apiRouter.get (endpoint + 'produtos/:id', (req, res) => {
    //res.status(200).send(`Produto selecionado: ${req.params.id}`)
    let produto = db_produtos.produtos.find(p => p.id == req.params.id)
    if (produto == null)
        res.status(404).json({ data : null })

    res.status(200).json({ data : produto })
})

apiRouter.post (endpoint + 'produtos', (req, res) => {
    let produto = req.body
    produto.id = NewId()
    db_produtos.produtos.push(produto)

    res.status(200).json({ data : produto })
})

apiRouter.put (endpoint + 'produtos/:id', (req, res) => {
    if (req.params.id != req.body.id)
        res.status(400).json({ errors : "O id informado é diferente do id do item." })
    
    let produtoIndex = db_produtos.produtos.findIndex(p => p.id == req.params.id)

    if (produtoIndex < 0)
        res.status(404).json({ data : null })
    
    db_produtos.produtos[produtoIndex].descricao = req.body.descricao
    db_produtos.produtos[produtoIndex].valor = req.body.valor
    db_produtos.produtos[produtoIndex].marca = req.body.marca

    res.status(200).json({ data : req.body })
})

apiRouter.delete (endpoint + 'produtos/:id', (req, res) => {
    let produtoIndex = db_produtos.produtos.findIndex(p => p.id == req.params.id)

    if (produtoIndex > -1) {
        db_produtos.produtos.splice(produtoIndex, 1)
    }

    res.status(200).json({ data : null })
})

function NewId() {
    let maxId = 0;
    db_produtos.produtos.forEach(produto => {
        if (produto.id > maxId)
            maxId = produto.id
    })
    return maxId+1
}

/*apiRouter.get(endpoint + 'produtos', (req, res) => {
    knex.select('*').from('produto')
    .then( produtos => res.status(200).json(produtos) )
    .catch(err => {
    res.status(500).json({
    message: 'Erro ao recuperar produtos - ' + err.message })
    })
})*/

//apiRouter.get(endpoint + 'produtos/:id', (req, res) => { ... })
//apiRouter.post(endpoint + 'produtos', (req, res) => { ... })
//apiRouter.put(endpoint + 'produtos/:id', (req, res) => { ... })
//apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { ... })

module.exports = apiRouter;
