const express = require ('express')
let apiRouter = express.Router()

//Processa corpo em formato JSON
apiRouter.use (express.json())

const environment = process.env.ENVIRONMENT || 'production'
const config = require('../../knexfile.js')[environment];
const knex = require('knex')(config);

const endpoint = '/'

apiRouter.get (endpoint + 'produtos', (req, res) => {
    knex.select('*').from('produtos').orderBy('id', 'asc')
        .then(produtos => res.status(200).json ({ data : produtos }))    
        .catch(err => res.status(400).json({ errors : `Erro ao obter produtos. ${err.message}` }))
})

apiRouter.get (endpoint + 'produtos/:id', (req, res) => {
    knex.select('*').from('produtos').where({ id: req.params.id })
        .then(produtos => {
            let produto = produtos[0]
            if (produto == null || produtos.length == 0)
                res.status(404).json({ data : null })
            
            res.status(200).json ({ data : produto })
        })
        .catch(err => res.status(400).json({ errors : `Erro ao obter o produto. ${err.message}` }))
})

apiRouter.post (endpoint + 'produtos', (req, res) => {
    let produtoRequest = req.body
    
    knex.select('*').from('produtos').where({ descricao: produtoRequest.descricao })
        .then(produtos => {
            let produto = produtos[0]
            if (produto != null)
                res.status(400).json({ errors : "Este produto já existe." })
        })
        .catch(err => res.status(400).json({ errors : `Erro ao obter o produto. ${err.message}` }))

    knex('produtos').insert(produtoRequest, ['id'])
        .then(produtos => {
            produtoRequest.id = produtos[0].id
            res.status(200).json({ data : produtoRequest })
        })
        .catch(err => res.status(400).json({ errors : `Erro ao cadastrar o produto. ${err.message}` }))
})

apiRouter.put (endpoint + 'produtos/:id', (req, res) => {
    let produtoRequest = req.body;

    if (req.params.id != produtoRequest.id)
        res.status(400).json({ errors : "O id informado é diferente do id do item." })
    
    knex.select('*').from('produtos').where({ id: req.params.id })
        .then(produtosSelect => {
            let produtoSelect = produtosSelect[0]
            if (produtoSelect == null || produtosSelect.length == 0)
                res.status(404).json({ data : null })
            
            knex('produtos').update(produtoRequest).where({ id: req.params.id })
                .then(produtosUpdate => {
                    let produtoUpdate = produtosUpdate[0]
                    res.status(200).json({ data : produtoRequest })
                })
                .catch(err => res.status(400).json({ errors : `Erro ao alterar o produto. ${err.message}` }))
        })
        .catch(err => res.status(400).json({ errors : `Erro ao obter o produto. ${err.message}` }))
})

apiRouter.delete (endpoint + 'produtos/:id', (req, res) => {
    knex('produtos').where({ id: req.params.id }).del(['id'])
        .then(produtos => {
        })
        .catch(err => res.status(400).json({ errors : `Erro ao excluir o produto. ${err.message}` }))
    
    res.status(200).json({ data : { id : req.params.id } })
})

module.exports = apiRouter;
