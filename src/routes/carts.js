const {Router} = require("express")
const {CartManager} = require("../dao/CartManager.js")
// const {} = require("../../data/carts.json")
const router = Router()

const cartsFile = './src/data/carts.json';
const cartManager = new CartManager(cartsFile);

// Traer Carrito
router.get("/:cid", async (req, res)=> {
    try{
        const id = Number(req.params.cid)
        const cart = await cartManager.getCart(id)
        if(!cart){
            res.status(404).send({message:`Error: el carrito con id ${id} no existe`})
            return
        }
        res.status(200).json(cart)
    }
    catch(err){
        res.status(500).send({message:`Error al obtener el carrito: ${err.message}`})
    }
})

// Agregar carrito 
router.post("/", async (req, res) => {
    try{
        // Validaciones...
        const {products} = req.body        
        if(!Array(products)){
            res.status(400).send({message: "Error: No contiene un array de productos"})
            return
        }
        await cartManager.addCart(req.body)
        res.status(201).send({message:`El carrito se ha creado con exito`})
    }
    catch(err){
        res.status(500).send({message:`Error al obtener el carrito: ${err.message}`})
    }
})

// Agregar un producto a un carrito especifico
router.post("/:cid/product/:pid", async (req, res) =>{
    try{
        const cid = Number(req.params.cid)
        const pid = Number(req.params.pid)
        const {quantity} = req.body

        if(isNaN(cid) || isNaN(pid)){
            res.status(400).json({message: `Error: id de carrito o del producto es invalido`})
            return
        }
        // Agrego el producto 
        await cartManager.addProductToCart(cid, pid,quantity)
        return res.status(201).json({message:`El producto de id ${pid} se ha agregado al carrito de id ${cid} exitosamente`})            
    }
    catch(err){
        res.status(500).send({error:`Error al agregar productos al carrito de id ${req.params.cid}: ${err.message}`})
    }
})

module.exports = router