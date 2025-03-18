const {Router} = require("express")
const {CartManager} = require("../dao/CartManager.js") 

const router = Router()

const cartsFile = './src/data/carts.json';
const cartManager = new CartManager(cartsFile);

// Traer Carrito
router.get("/:cid", async (req, res)=> {
    try{
        const id = Number(req.params.cid)
        const cart = await cartManager.getCart(id)
        if(isNaN(id)){
            return res.status(400).json({error: "El id del carrito es invalido"})
        }
        if(!cart){
            return res.status(404).json({error:`Error: el carrito con id ${id} no existe`})
        }
        return res.status(200).json(cart)
    }
    catch(err){
        return res.status(500).json({error:`Error al obtener el carrito: ${err.message}`})
    }
})

// Agregar carrito 
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

// Agregar un producto a un carrito especifico
router.post("/:cid/product/:pid", async (req, res) =>{
    try{
        const cid = Number(req.params.cid)
        const pid = Number(req.params.pid)
        const {quantity} = req.body
        
        if(quantity == 0 || typeof(quantity) != "number"){
            return res.status(400).json({error: "La cantidad de productos es invalida"})
        }

        if(isNaN(cid) || isNaN(pid)){
           return res.status(400).json({error: `Error: id de carrito o del producto es invalido`})
        }
        await cartManager.addProductToCart(cid, pid,quantity)
        return res.status(201).json({message:`El producto de id ${pid} se ha agregado al carrito de id ${cid} exitosamente`})

    }
    catch(err){
        return res.status(500).json({error:`Error al agregar productos al carrito de id ${req.params.cid}: ${err.message}`})
    }
})

module.exports = router