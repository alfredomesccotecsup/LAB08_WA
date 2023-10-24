const mainContent = document.querySelector('.main-content');
const listarUsuariosBtn = document.getElementById('listarUsuariosBtn');
const crearUsuarioBtn = document.getElementById('crearUsuarioBtn');

const cargarContenido = (url) => {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      mainContent.innerHTML = data;
    });
};

listarUsuariosBtn.addEventListener('click', () => {
  cargarContenido('/users/listar-usuarios');
});

crearUsuarioBtn.addEventListener('click', () => {
  cargarContenido('/users/crear-usuario');
});

const editarUsuario = (userId) => {
  cargarContenido(`/users/edit/${userId}`);
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-user-btn')) {
    const userId = event.target.getAttribute('data-user-id');
    editarUsuario(userId);
  }

  if (event.target.id === 'regresarListadoUsuarios') {
    cargarContenido('/users/listar-usuarios');
  }
});

const updateUserBtn = document.getElementById('updateUserBtn');

updateUserBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const userId = event.target.getAttribute('data-user-id');
  fetch(`/users/update/${userId}`, {
    method: 'POST',
    body: new FormData(document.querySelector('form'))
  })
    .then((response) => response.text())
    .then((data) => {
      mainContent.innerHTML = data;
    });
});
