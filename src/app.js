import express from 'express'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import routerProducts from './routes/products.js'
import routerCarts from './routes/carts.js'
import viewsRouter from './routes/views.js'
import {ProductManager} from './dao/ProductManager.js'
import { connectDB } from './config/db.js'
import { config } from './config/config.js'

const app = express()
const port = config.PORT
let io = undefined;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine(
    {
        helpers: {
            eq: (a, b) => a === b
        }
    }
))
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use('/', viewsRouter)

app.use("/api/products", (req, res, next) => {
    req.io = io
    next()
} ,routerProducts)
app.use("/api/carts", routerCarts)

app.use(express.static('./src/views'))
app.use(express.static('./src/public'))


// App
app.get("/", async (req, res) => {
    res.status(200).send({message:"Bienvenido a Mundo Tech! El mejor retail de tecnologia"})
})

const serverHttp = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
io = new Server(serverHttp)

const productManager = new ProductManager()

// Conexion server websocket
io.on("connection", socket => {
    console.log("Nuevo cliente conectado")

    socket.on("new", async product => {
        await productManager.addProduct(product)
        io.emit("newProduct", product)
    })
    socket.on('drop', async id => {
        await productManager.deleteProduct(id)
        io.emit('deleteProduct', id)
    })

    socket.on("disconnect", () => {
        console.log("Cliente desconectado")
    })
})
connectDB(config.DB, config.dbName)

export default io
