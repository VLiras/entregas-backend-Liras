const fs = require("fs")

// clase CartManager
class CartManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }
    async getCart(id){
        if(!fs.existsSync(this.path)){
            throw new Error("No existe el archivo")
        }   
        const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        
        const cart = data.find(cart => cart.id === id)

        if(!cart){
            return `No se encontró el carrito con el id ${id}`
        }
        return cart
    }
    async getCarts(){
        if(!fs.existsSync(this.path)){
            throw new Error("No existe el archivo")
        }
        const data = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        return data
    }
    async addCart(){
        const carts = await this.getCarts()
        const newCart = { id: carts.length + 1, products:[]}

        carts.push(newCart)
        await fs.writeFile(this.path, JSON.stringify(carts, null, 5), (e) => console.log(e))
        return
    }
    
    async addProductToCart(idCart, idProd, units){
        const carts = await this.getCarts()
    
        const cart = carts.find(c => c.id === idCart) // => Objeto 
        
        if(!cart){
            throw new Error(`No se encontro el carrito`)
        }
        const index = carts.indexOf(cart)
        const cartProductsList = cart.products
        // Verifico que el producto ya exista en el array de productos
        const product = cartProductsList.find(p => p.product === idProd)
    
        if(!product){
            cartProductsList.push({product: idProd, quantity: units})
            const updatedCart = {...cart}
            carts[index] = updatedCart
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
            return
        }
        else{
            product.quantity += units
            const updatedCart = {...cart}
            
            carts[index] = updatedCart
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
            return
        }
    }
}
const file = "../data/carts.json";
const manager = new CartManager(file)

const app = async () => {
    // Creo un carrito nuevo
    
    // await manager.addCart()
        
    await manager.addProductToCart(1, 1, 5)
    await manager.addProductToCart(1, 2, 4)
    console.log(await manager.getCart(1))
}


module.exports = {
    CartManager
}