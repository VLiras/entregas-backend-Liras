import { cartsModel } from "./models/cartsModel.js"

// clase CartManager
export class CartManager {
    async getCart(id){
        return await cartsModel.findById(id).lean()
    }
    async getCarts(){
        return await cartsModel.find().lean()
    }
    async addCart(cart = {}){
        return await cartsModel.create(cart)
    }
    
    async addProductToCart(idCart, idProd, units){
        const updatedCart = await cartsModel.findOneAndUpdate(
            { _id: idCart, "products.product": idProd },
            { $inc: { "products.$.quantity": units } }, 
            { new: true }
        ).lean();

        if (!updatedCart) {
            return await cartsModel.findByIdAndUpdate(
            idCart,
            { $push: { products: { product: idProd, quantity: units } } },
            { new: true }
            ).lean();
  }
  return updatedCart;
    }
    async updateCart(id, products){
        return await cartsModel.findByIdAndUpdate(id, { products }, { new: true }).lean()
    }
    async updateProduct(idCart, idProd, units) {
        return await cartsModel.findOneAndUpdate(
          { _id: idCart, "products.product": idProd }, 
          { $set: { "products.$.quantity": units } }, 
          { new: true }
        );
      }
    async deleteCart(id){
        return await cartsModel.findByIdAndDelete(id)
    }
    async deleteProductFromCart(idCart,idProd){
        return await cartsModel.findByIdAndUpdate(idCart, { $pull: { products: { product: idProd}} }, { new: true }).lean()
    }
}
// const file = "../data/carts.json";
// const manager = new CartManager(file)



