const {Router} = require('express')
// const {} = require('../app.js')
const {ProductManager} = require('../dao/ProductManager.js');
const io = require('../app.js');
// import { ProductManager } from "../dao/ProductManager"
// const io = require("../app.js");


const router = Router()

const productsFile = "./src/data/products.json";
const prodManager = new ProductManager(productsFile)


router.get("/", async (req, res) => {
    try{
        const products = await prodManager.getProducts()

        res.setHeader('Content-Type','application/json');
        res.status(200).json(products)
    }
    catch(err){
        res.status(500).json({message:`Error al obtener los productos: ${err.message}`})
    }
})

router.get("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id)
        const product = await prodManager.getProductById(id)
        if(!product){
            res.status(404).json({message:`Error: el producto con id ${id} no existe`})
            return
        }
        res.status(200).json(product)
    }
    catch(err){
        res.status(500).json({message:`Error al obtener el producto: ${err.message}`})
    }
})

router.post("/",async (req, res) => {
    try{
        const {title, description,code,price,status, stock, category, thumbnails} = req.body
   
        // Validaciones
        if(!title || !description || !code || !status || !category){
            res.status(400).json({message: "Falta completar campos"})
            return
        } 
        if(price == 0 || price == null || isNaN(price)){
            res.status(400).json({message:"El producto no tiene precio o es invalido"})
            return
        }
        if(stock == 0 || stock == null){
            res.status(400).json({message:"El producto no tiene stock o es invalido"})
            return
        }
        // Agregado del producto
        await prodManager.addProduct(req.body)

        req.io.emit("newProduct", req.body)

        return res.status(201).json({message:"El producto se ha creado exitosamente!"})
    }
    catch(err){
        return res.status(500).json({message:`Error al agregar el producto: ${err.message}`})
    }
})

// Metodo put para actualizar un producto 
router.put("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id)
        if(isNaN(id)){
            res.status(400).json({message: "El id es invalido"})
            return
        }

        const product = await prodManager.getProductById(id)

        if(!product){
            res.status(404).json({message:`Error: el producto con id ${id} no existe`})
            return
        }
        const {title, price, code} = req.body
        if(!title || !code){
            res.status(400).json({message: "Complete los campos a modificar"})
            return
        }
        if(!price || price <= 0){
            res.status(400).json({message: "El precio ingresado es invalido"})
            return
        }

        // Actualización del producto
        await prodManager.updateProduct(id, req.body)
    
        res.status(200).json({message:"El producto se ha actualizado con exito"})
        return
    }
    catch(err){
        res.status(500).json({message: `Error al actualizar el producto de id ${req.params.id}: ${err.message}`})
    }
})

// Metodo delete
router.delete("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id)
        if(isNaN(id)){
            res.status(400).json({message: "Error: el id es invalido"})
            return
        }
        const product = await prodManager.getProductById(id)
        // const product = await productManager.getProductById(id)
        if(!product){
            res.status(404).json({message:`Error: el producto con id ${id} no existe`})
            return
        }
        await prodManager.deleteProduct(id)
            
        req.io.emit("dropProduct", product)
        return res.status(200).json({message:"El producto se ha eliminado con exito"})
    }
    catch(err){
        return res.status(500).json({message: `Error al eliminar el producto de id ${req.params.id}: ${err.message}`})
    }
})

module.exports = router