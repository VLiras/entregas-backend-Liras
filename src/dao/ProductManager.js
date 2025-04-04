import { productsModel } from './models/productsModel.js';

export class ProductManager {
    async getProducts(page = 1, limit = 10, sort, query = {}){
        if(!sort){
                return await productsModel.paginate(query, {page, limit,lean:true})
        }
        return await productsModel.paginate(query, {page, limit,sort:{price:sort},lean:true})
    }
    async getProductById(id){
        return await productsModel.findById(id).lean()
    }
    async addProduct(product){
        return await productsModel.create(product)
    }
    async updateProduct(id, data){
        return await productsModel.findByIdAndUpdate(id, data, {new: true})
    }
    async deleteProduct(id){
        return await productsModel.findByIdAndDelete(id)
    }
}

