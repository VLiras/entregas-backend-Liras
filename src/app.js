const express = require("express")
const {engine} = require('express-handlebars')
const {Server} = require('socket.io')
const routerProducts = require("./routes/products.js")
const routerCarts = require('./routes/carts.js')
const viewsRouter = require('./routes/views.js')
const {ProductManager} = require('./dao/ProductManager.js')

const app = express()
const port = 8080
let io = undefined;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use('/', viewsRouter)

app.use("/api/products", (req, res, next) => {
    req.io = io
    next()
} ,routerProducts)
app.use("/api/carts", routerCarts)

app.use(express.static('./views'))
app.use(express.static(__dirname + '/public'))


// App
app.get("/", async (req, res) => {
    res.status(200).send({message:"Bienvenido a Mundo Tech! El mejor retail de tecnologia"})
})

const serverHttp = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})
io = new Server(serverHttp)

const productManager = new ProductManager("./src/data/products.json")

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
module.exports = io
