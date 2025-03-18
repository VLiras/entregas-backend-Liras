const {Router} = require('express')
const {ProductManager} = require('../dao/ProductManager.js')


const router = Router()
const file = './src/data/products.json'
const manager = new ProductManager(file)


router.get('/realtimeproducts', async(req, res) => {
    let products = await manager.getProducts()
    res.status(200).render('realTimeProducts', {
        products
    })
})
router.get('/', async (req, res) => {
    let products = await manager.getProducts()
    res.status(200).render('home', {
        products
    })
})

module.exports = router

