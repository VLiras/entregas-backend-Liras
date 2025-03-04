const express = require("express")

const routerProducts = require("./routes/products.js")
const routerCarts = require('./routes/carts.js')

const app = express()
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts)

// App
app.get("/", (req, res) => {
    res.status(200).send({message:"Bienvenido a Mundo Tech! El mejor retail de tecnologia"})
})

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})