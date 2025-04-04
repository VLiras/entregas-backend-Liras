import { Router } from "express";
import { CartManager } from "../dao/CartManager.js";
import { isValidObjectId } from "mongoose";

const router = Router()
const cartManager = new CartManager();

router.get("/:cid", async (req, res)=> {
    const {cid} = req.params 
    if(!isValidObjectId(cid)){
        return res.status(400).json({error: "El id del carrito es invalido"})
    }
    try{
        const cart = await cartManager.getCart(cid)
        if(!cart){
            return res.status(404).json({error:`Error: el carrito con id ${id} no existe`})
        }
        return res.status(200).json(cart)
    }
    catch(err){
        return res.status(500).json({error:`Error al obtener el carrito: ${err.message}`})
    }
})

router.post("/", async (req, res) => {
    try{
        const {products} = req.body 
        if(typeof(products) !="object"){
            return res.status(400).send({message: "Error: El carrito no contiene un array de productos"})
        }
        await cartManager.addCart(req.body)
        return res.status(201).send({message:`El carrito se ha creado con exito`})
    }
    catch(err){
        return res.status(500).send({error:`Error al obtener el carrito: ${err.message}`})
    }
})

router.post("/:cid/product/:pid", async (req, res) =>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
       return res.status(400).json({error: `Error: id de carrito o del producto es invalido`})
    }
    try{
        if(quantity == 0 || typeof(quantity) != "number"){
            return res.status(400).json({error: "La cantidad de productos es invalida"})
        }
        await cartManager.addProductToCart(cid, pid,quantity)
        return res.status(201).json({message:`El producto de id ${pid} se ha agregado al carrito de id ${cid} exitosamente`})
    }
    catch(err){
        return res.status(500).json({error:`Error al agregar productos al carrito de id ${req.params.cid}: ${err.message}`})
    }
})
router.delete('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({error: `Error: id de carrito o del producto es invalido`})
    }
    try {
        await cartManager.deleteProductFromCart(cid, pid)
        return res.status(200).json({message:`El producto de id ${pid} se ha eliminado con exito`})
    }
    catch(err){
        return res.status(500).json({error:`Error al agregar productos al carrito de id ${req.params.cid}: ${err.message}`})
    }
})
router.put('/:cid', async (req, res) => {
    const {cid} = req.params
    const products = req.body
    if(!Array.isArray(products)){
        return res.status(400).json({error: "La lista de productos es invalida"})
    }
    if(!isValidObjectId(cid)){
        return res.status(400).json({error: `Error: id de carrito es invalido`})
    }
    try{
        await cartManager.updateCart(cid, products)
        return res.status(200).json({message:`El carrito de id ${cid} ha sido actualizado con exito`})
    }
    catch(err){
        return res.status(500).json({error:`Error al actualizar el carrito de id ${cid}`})
    }
})
router.put('/:cid/products/:pid', async (req, res) => {
    const {cid, pid} = req.params
    const {quantity} = req.body
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        return res.status(400).json({error: `Error: id de carrito o del producto son invalidos`})
    }
    if(!quantity || quantity <= 0){
        return res.status(400).json({error: "La cantidad de ejemplares debe ser mayor que cero"})
    }
    try{
        await cartManager.updateProduct(cid, pid, quantity)
        return res.status(200).json({message:`El producto de id ${pid} ha sido actualizado`})
    }
    catch(err){
        return res.status(500).json({error:`Error al actualizar el producto ${pid} del carrito ${cid}`, 
        details:err.message
        })
    }
})
router.delete('/:cid', async (req, res) => {
    const {cid} = req.params
    if(!isValidObjectId(cid)){
        return res.status(400).json({error: `Error: id de carrito es invalido`})
    }
    try {
        await cartManager.deleteCart(cid)
        return res.status(200).json({message:`El carrito de id ${cid} ha sido eliminado`}) 
    } catch (error) {
        return res.status(500).json({error:`Error al eliminar el carrito`})
    }
})
export default router
