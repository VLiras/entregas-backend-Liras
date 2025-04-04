import {Router} from 'express'
import {ProductManager} from '../dao/ProductManager.js'
import { isValidObjectId } from 'mongoose'
import { productsModel } from '../dao/models/productsModel.js'
import { CartManager } from '../dao/CartManager.js'


const router = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()


router.get('/realtimeproducts', async(req, res) => {
    let products = await productManager.getProducts()
    return res.status(200).render('realTimeProducts', {
        products
    })
})
router.get('/products', async (req, res) => {
    let {page, limit, sort, category, status} = req.query
    if(!page){
        page = 1
    }
    if(!limit){
        limit = 10
    }
    const query = {}
    if(category){
        query.category = category
    }
    if(status){
        query.status = status
    }
            
    const {
        docs: products, 
        totalPages, 
        hasPrevPage, 
        prevPage, 
        hasNextPage, 
        nextPage} = await productManager.getProducts(page, limit, sort, query)
    
    return res.status(200).render('home', {
        products, 
        totalPages,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage, 
        limit
    })
})
router.get('/products/:pid', async (req, res) => {
    const {pid} = req.params
    if(!isValidObjectId(pid)){
        return res.status(400).json({error:`Ingrese un id valido`})
    }
    const productView = []
    try {
        const product = await productManager.getProductById(pid)
        productView.push(product)
        return res.status(200).render('product', {
            productView
        }
    )
    } 
    catch (error) {
        return res.status(500).json({error:`Error al renderizar la vista producto`, details:error.message})
    }
})
router.get('/carts/:cid', async (req, res) => {
    const {cid} = req.params
    if(!isValidObjectId(cid)){
        return res.status(400).json({error:`Ingrese un id valido`})
    }
    try {
        const cart = await cartManager.getCart(cid)
        const products = cart.products
                
        return res.status(200).render('cart', {
            products
        })
    } catch (error) {
        return res.status(500).json({error:`Error al renderizar la vista carrito`, details:error.message})
    }
})  

export default router


