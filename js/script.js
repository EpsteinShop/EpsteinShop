document.addEventListener('DOMContentLoaded', () => {
  // Inicialización del modal de consultas
  const btnConsultar = document.querySelectorAll('.btn-consultar');

  document.addEventListener('DOMContentLoaded', () => {
  const formConsulta = document.getElementById('formConsulta');
  const mensajeExito = document.getElementById('mensajeExito');

  if (formConsulta) {
    formConsulta.addEventListener('submit', (e) => {
      e.preventDefault();
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
        formConsulta.reset();
        window.scrollTo({ top: formConsulta.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }
});
  
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
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById('consultModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');

  btnConsultar.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const card = button.closest('.product-card');
      if (card) {
        const productTitle = card.querySelector('.product-title')?.textContent || 'este producto';
        modalTitle.textContent = `Consulta sobre: ${productTitle}`;
        modalMessage.textContent = `Gracias por tu interés en ${productTitle}. Un asesor de Chamarket te atenderá a la brevedad.`;
      } else {
        modalTitle.textContent = 'Contactar a un Asesor';
        modalMessage.textContent = 'Un asesor te contactará para brindarte información detallada sobre nuestros catálogos.';
      }

      modal.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
});