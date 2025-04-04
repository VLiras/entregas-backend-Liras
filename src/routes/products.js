import { Router } from 'express';
import { ProductManager } from '../dao/ProductManager.js';
import { isValidObjectId } from 'mongoose';

const router = Router()

const prodManager = new ProductManager()

router.get("/", async (req, res) => {
    let {page, limit} = req.query
    if(!page){
        page = 1
    }
    if(!limit){
        limit = 10
    }
    try{
        const products = await prodManager.getProducts(page, limit)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(products)
    }
    catch(err){
        return res.status(500).json({message:`Error al obtener los productos: ${err.message}`})
    }
})

router.get("/:id", async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)){
        return res.status(400).json({error:'El id ingresado es invalido'})
    }
    try{
        const product = await prodManager.getProductById(id)
        if(!product){
            return res.status(404).json({message:`Error: el producto con id ${id} no existe`})
        }
        return res.status(200).json(product)
    }
    catch(err){
        res.status(500).json({message:`Error al obtener el producto: ${err.message}`})
    }
})

router.post("/",async (req, res) => {
    try{
        const {title, description,code,price,status, stock, category} = req.body
        // Validaciones
        if(!title || !description || !code || !status || !category){
            res.status(400).json({message: "Falta completar campos"})
            return
        } 
        if(price == 0 || !price || isNaN(price)){
            res.status(400).json({message:"El producto no tiene precio o es invalido"})
            return
        }
        if(stock == 0 || !stock){
            res.status(400).json({message:"El producto no tiene stock o es invalido"})
            return
        }
        await prodManager.addProduct(req.body)

        req.io.emit("newProduct", req.body)

        return res.status(201).json({message:"El producto se ha creado exitosamente!"})
    }
    catch(err){
        return res.status(500).json({message:`Error al agregar el producto: ${err.message}`})
    }
})


router.put("/:id", async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)){
        return res.status(400).json({error:'El id ingresado es invalido'})
    }
    const {title, price, code} = req.body
    if(!title || !code){
        return res.status(400).json({message: "Complete los campos a modificar"})
    }
    if(!price || price <= 0){
        return res.status(400).json({message: "El precio ingresado es invalido"})
    }
    try{
        await prodManager.updateProduct(id, req.body)
        return res.status(200).json({message:"El producto se ha actualizado con exito"})
    }
    catch(err){
        return res.status(500).json({message: `Error al actualizar el producto de id ${req.params.id}: ${err.message}`})
    }
})


router.delete("/:id", async (req, res) => {
    const {id} = req.params
    if(!isValidObjectId(id)){
        return res.status(400).json({error:'El id ingresado es invalido'})
    }
    try{
        await prodManager.deleteProduct(id)
            
        // req.io.emit("dropProduct", product)
        return res.status(200).json({message:"El producto se ha eliminado"})
    }
    catch(err){
        return res.status(500).json({message: `Error al eliminar el producto de id ${req.params.id}: ${err.message}`})
    }
})

export default router