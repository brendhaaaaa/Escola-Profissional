document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    const users = {
        'Brendha': '54321',
        'Ingridi': '12345'
    };

    if (users[usernameInput] && users[usernameInput] === passwordInput) {

        window.location.href = "escola.html";
    } else {

        errorMessage.textContent = "Nome de usuário ou senha inválidos.";
    }
});
