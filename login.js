document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio do formulário tradicional

    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Usuários permitidos com senhas
    const users = {
        'Brendha': '54321',
        'Ingrid': '12345'
    };

    // Validação simples
    if (users[usernameInput] && users[usernameInput] === passwordInput) {
        // Login válido, redirecionar para a página desejada
        // Atualize o caminho abaixo para o caminho real da sua página destino
        window.location.href = "escola.html";
    } else {
        // Usuário ou senha inválidos
        errorMessage.textContent = "Nome de usuário ou senha inválidos.";
    }
});
