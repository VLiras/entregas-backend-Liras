const socket = io()

const getThumbnails = () => {
    const thumb = document.getElementById('thumbnail').value
    if(thumb == undefined || thumb == ''){
        return []
    }
    return thumb
}

const sendProduct = () => {
    const newProduct = {
        title: document.getElementById('title').value, 
        description:document.getElementById('description').value, 
        code:document.getElementById('code').value, 
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        stock:document.getElementById('stock').value, 
        thumbnails: getThumbnails()
    }
    
    socket.emit('new', newProduct)
    return
}
const form = document.getElementById('form')
form.addEventListener('submit', e => {
    e.preventDefault();
    sendProduct()
})

socket.on("newProduct", () => {
    window.location.reload()
})

const dropButton = document.querySelectorAll('.dropButton')
dropButton.forEach(button => {
    button.addEventListener('click', () => {
        // Busco el id del boton eliminar de cada card
        const id = button.parentNode.parentNode.parentNode.id
        socket.emit('drop', Number(id))
    })
})

socket.on("deleteProduct", () => {
    window.location.reload()
})

// Ir a la vista del producto
const buttonToCart = document.getElementById('addToCart')
button.onclick = () => {
    alert('Agregando al carrito')
}

