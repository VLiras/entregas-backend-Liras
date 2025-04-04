import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2'
const productsSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true, 
            index: true
        }, 
        description:String, 
        price:{
            type:Number,
            required:true, 
            index:true
        }, 
        code:{
            type:String,
            required:true, 
            unique:true
        }, 
        category:{
            type:String, 
            required:true,
            index:true
        },
        stock:Number, 
        status:{
            type:Boolean,
            default:true
        }, 
        thumbnails:{
            type:[], 
            default:[],
        }
    }, 
    {
        timestamps:true,
    }
)

productsSchema.plugin(paginate)
export const productsModel = mongoose.model(
    'products',
    productsSchema
)