document.addEventListener('DOMContentLoaded', () => {
  const formConsulta = document.getElementById('formConsulta');
  //<form id="formConsulta"></...>
  const mensajeExito = document.getElementById('mensajeExito');

  if (formConsulta) {
    formConsulta.addEventListener('submit', (e) => {
      e.preventDefault();
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
        //formConsulta.reset();
        window.scrollTo({ top: formConsulta.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }

  // Estructura del modal de consulta existente
  const modalHTML = `
    <div class="modal-overlay" id="consultModal">
      <div class="modal-box">
        <i class="fa-solid fa-circle-check success-icon"></i>
        <h3 id="modalTitle">Consulta Enviada</h3>
        <p id="modalMessage">Nos pondremos en contacto contigo a la brevedad con la información del producto.</p>
        <button class="modal-close" id="modalCloseBtn">Aceptar</button>
      </div>
    </div>
  `;
  if (!document.getElementById('consultModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('consultModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');

  //Arreglamos esto:
  const boton_consultar_p = document.getElementById("btn-consultar-p");
  if(boton_consultar_p){
    boton_consultar_p.addEventListener("click", (e) => {
        e.preventDefault();
        //<button type="reset">...</...>
        const card = boton_consultar_p.closest('.product-card');
        if (card) {
          const productTitle = card.querySelector('.product-title')?.textContent || 'este producto';
          modalTitle.textContent = `Consulta sobre: ${productTitle}`;
          modalMessage.textContent = `Gracias por tu interés en ${productTitle}. Un asesor de Chamarket te atenderá a la brevedad.`;
        }
        modal.classList.add('active');
    })
  }

  
/* CÓDIGO ANTES:
  document.getElementById('btn-consultar-p').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.product-card');
      if (card) {
        const productTitle = card.querySelector('.product-title')?.textContent || 'este producto';
        modalTitle.textContent = `Consulta sobre: ${productTitle}`;
        modalMessage.textContent = `Gracias por tu interés en ${productTitle}. Un asesor de Chamarket te atenderá a la brevedad.`;
      }
      modal.classList.add('active');
    });
  });
  */

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });


  // ==========================================
  // LÓGICA DEL CARRITO DE COMPRAS Y BARRA LATERAL
  // ==========================================

  let cart = JSON.parse(localStorage.getItem('chamarket_cart')) || [];

  // Inyectar Botón Flotante y Barra Lateral en el DOM
  const cartComponentsHTML = `
    <button class="floating-cart-btn" id="floatingCartBtn" title="Ver Carrito">
      <i class="fa-solid fa-cart-shopping"></i>
      <span class="cart-badge-count" id="cartBadgeCount">0</span>
    </button>

    <div class="cart-sidebar-overlay" id="cartSidebarOverlay"></div>
    <div class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h3><i class="fa-solid fa-cart-shopping"></i> Tu Carrito</h3>
        <button class="cart-close-btn" id="cartCloseBtn"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="cart-items-container" id="cartItemsContainer">
        <!-- Los productos se cargan dinámicamente -->
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span id="cartTotalPrice">S/ 0.00</span>
        </div>
        <a href="checkout.html" class="btn-checkout" id="btnRealizarCompra">Realizar Compra</a>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', cartComponentsHTML);

  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartSidebarOverlay = document.getElementById('cartSidebarOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const cartTotalPrice = document.getElementById('cartTotalPrice');

  // Funciones de apertura y cierre de barra lateral
  function toggleCart(open) {
    if (open) {
      cartSidebar.classList.add('active');
      cartSidebarOverlay.classList.add('active');
    } else {
      cartSidebar.classList.remove('active');
      cartSidebarOverlay.classList.remove('active');
    }
  }

  floatingCartBtn.addEventListener('click', () => toggleCart(true));
  cartCloseBtn.addEventListener('click', () => toggleCart(false));
  cartSidebarOverlay.addEventListener('click', () => toggleCart(false));

  // Guardar en LocalStorage y actualizar vista
  function saveAndRenderCart() {
    localStorage.setItem('chamarket_cart', JSON.stringify(cart));
    renderCartItems();
  }

  // Renderizar productos en la barra lateral
  function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted); margin-top: 40px;">Tu carrito está vacío</p>';
      cartBadgeCount.textContent = '0';
      cartTotalPrice.textContent = 'S/ 0.00';
      return;
    }

    cart.forEach((item, index) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-title" title="${item.name}">${item.name}</span>
          <span class="cart-item-price">S/ ${item.price.toFixed(2)} c/u</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn decrease-qty" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn increase-qty" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartBadgeCount.textContent = totalItems;
    cartTotalPrice.textContent = `S/ ${totalPrice.toFixed(2)}`;

    // Asignar eventos a los botones de + y -
    document.querySelectorAll('.increase-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        cart[idx].quantity += 1;
        saveAndRenderCart();
      });
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveAndRenderCart();
      });
    });
  }

  // Capturar clicks en los botones "Agregar" de las tarjetas de producto
  document.querySelectorAll('.btn-agregar-prod').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      const name = card.querySelector('.product-title').textContent.trim();
      const priceText = card.querySelector('.product-price').textContent.replace('S/', '').trim();
      const price = parseFloat(priceText);

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      saveAndRenderCart();
      toggleCart(true); // Abre la barra lateral al agregar
    });
  });

    const boton_comprar_p = document.getElementById("btn-checkout");
  if (boton_comprar_p) {
    boton_comprar_p.addEventListener("click",async ()=>{
    
    const res = await fetch("https://epsteinshop.1756542.workers.dev/", {
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body: JSON.stringify({
        "Producto":"Nombre del Producto",
        "Precio":"Precio del Producto",
        "Cantidad":"Cantidad del Producto",
        "Cliente":{
          "Nombre":"Nombre del Cliente",
          "Edad":"Edad del Cliente"
        },
        "Fecha_pago":"Fecha de Pago"
      })
    });

    const resJson = await res.json()
    console.log(resJson)
    
  
    console.log(`\n\n
        URL: Url de la API
        Method: POST
        headers: Content-Type: Application/Json - Text/Plain
        body: {
          "Producto":"Nombre del Producto",
          "Precio":"Precio del Producto",
          "Cantidad":"Cantidad del Producto",
          "Cliente":{
            "Nombre":"Nombre del Cliente",
            "Edad":"Edad del Cliente"
          },
          "Fecha_pago":"Fecha de Pago"
        }
      `);
      
  })
  }
  /* CODIGO API CLOUDFLARE
export default {
  async fetch(request, env, ctx) {
    //Si es válido
    if (request.method === 'POST') {
      const data = await request.json();
      console.log(`[i] Nueva pedido entrante!`)
      console.log(data)
      console.log("[i] Almacenando cliente en la base de datos...")
      console.log("[$] Cliente almacenado en la base de datos!")
      console.log("[$] Pedido enviándose con éxito!")
      
      return new Response(JSON.stringify({ success: true, received: data }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    //Si es inválido
    return new Response('Método no permitido', { status: 405 });
  }
};
*/

  // Inicializar renderizado al cargar la página
  renderCartItems();
});
