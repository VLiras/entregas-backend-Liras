const productContainer = document.getElementById('productContainer')
const addToCartButton = document.getElementById('addToCart')
const cartIdValue = document.getElementById('cartInput')
let productId = productContainer.dataset.pid;

const cartId = () => {
    const value = cartIdValue.value;
    return value
}

const addToCart = async (e) => {
    e.preventDefault();
    await fetch(`/api/carts/${cartId()}/product/${productId}`, {
        method: 'POST',
        cors:'no-cors',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            'quantity': 1
        })
    })
    if (!response.ok) {
        throw new Error('Error al agregar el producto al carrito');
    }
    console.log('Enviado exitosamente')
}

addToCartButton.addEventListener('click', (e) => {
    addToCart(e)
})
