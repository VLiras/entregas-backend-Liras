const addToCartButtons = document.querySelectorAll('.addToCartButton');
const input = document.getElementById('addToCartInput')

  // Agregar un evento click a cada botón
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const card = button.closest('.card');
      const pid = card.dataset.pid;
      
      const cartId = input.value;
      
      const quantity = 1;

      try {
         const response = await fetch(`/api/carts/${cartId}/product/${pid}`, {
          method: 'POST',
          cors:'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
          throw new Error('Error al agregar el producto al carrito');
        }
        const result = await response.json();
        console.log(result);
        alert('Producto agregado al carrito con éxito');
      } catch (err) {
        console.error('Error:', err);
      }
    });
  });
