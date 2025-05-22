const cursos = [];
const clientes = [];
const vendas = [];

document.addEventListener('DOMContentLoaded', () => {
    // Cadastro de Curso
    document.getElementById('cursoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('cursoNome').value.trim();
        const carga = document.getElementById('cursoCarga').value.trim();
        const valor = document.getElementById('cursoValor').value.trim();

        if (cursos.some(curso => curso.nome.toLowerCase() === nome.toLowerCase())) {
            alert("Este curso já foi cadastrado.");
            return;
        }

        const curso = { nome, carga, valor };
        cursos.push(curso);

        atualizarSelecaoCursosDetalhe();
        atualizarCursosParaClientes();

        document.getElementById('cursoNome').value = "";
        document.getElementById('cursoCarga').value = "";
        document.getElementById('cursoValor').value = "";
    });

    // Cadastro de Cliente
    document.getElementById('clienteForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('clienteNome').value.trim();
        const cpf = document.getElementById('clienteCPF').value.trim();
        const cursoIndex = document.getElementById('cursoCliente').value;

        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length === 0 || cpfLimpo.length > 14) {
            alert("CPF inválido.");
            document.getElementById('clienteCPF').classList.add('error');
            return;
        }

        if (cursoIndex === "") {
            alert("Selecione um curso.");
            document.getElementById('cursoCliente').classList.add('error');
            return;
        }

        let cliente = clientes.find(c => c.cpf === cpf);

        if (!cliente) {
            cliente = { nome, cpf };
            clientes.push(cliente);
        }

        // Adiciona venda com base no cadastro
        const cursoNome = cursos[cursoIndex].nome;
        vendas.push({ cliente: nome, cpf, curso: cursoNome });

        atualizarSelecaoClientes();
        atualizarVendas();

        document.getElementById('clienteNome').value = "";
        document.getElementById('clienteCPF').value = "";
        document.getElementById('cursoCliente').value = "";
        document.getElementById('clienteCPF').classList.remove('error');
        document.getElementById('cursoCliente').classList.remove('error');
    });

    // Atualiza o select de clientes no form de venda
    function atualizarSelecaoClientes() {
        const selectCliente = document.getElementById('clienteSelect');
        selectCliente.innerHTML = "<option value=''>Selecione um cliente</option>";
        clientes.forEach((cliente, index) => {
            selectCliente.innerHTML += `<option value="${index}">${cliente.nome}</option>`;
        });
    }

    // Preencher automaticamente o curso do cliente mais recente
    document.getElementById('clienteSelect').addEventListener('change', function () {
        const clienteIndex = this.value;
        const inputCurso = document.getElementById('cursoInputVenda');

        if (clienteIndex === "") {
            inputCurso.value = "";
            return;
        }

        const cliente = clientes[clienteIndex];
        const ultimaVenda = vendas.slice().reverse().find(v => v.cpf === cliente.cpf);

        inputCurso.value = ultimaVenda ? ultimaVenda.curso : "";
    });

    // Registrar Venda
    document.getElementById('vendaForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const clienteIndex = document.getElementById('clienteSelect').value;
        const cursoNome = document.getElementById('cursoInputVenda').value;

        if (clienteIndex === "") {
            alert("Selecione um cliente.");
            return;
        }

        const cliente = clientes[clienteIndex];

        if (!cursoNome) {
            alert("Curso do cliente não encontrado.");
            return;
        }

        vendas.push({
            cliente: cliente.nome,
            cpf: cliente.cpf,
            curso: cursoNome
        });

        atualizarVendas();
        limparDetalhesVenda();
    });

    // Limpar detalhes após registrar venda
    function limparDetalhesVenda() {
        document.getElementById('clienteVenda').innerText = 'Cliente: ';
        document.getElementById('cursoVenda').innerText = 'Curso: ';
        document.getElementById('clienteSelect').value = "";
        document.getElementById('cursoInputVenda').value = "";
    }

    // Atualizar lista de vendas no HTML
    function atualizarVendas() {
        const listaVendas = document.getElementById('listarVendas');
        listaVendas.innerHTML = "";
        vendas.forEach(venda => {
            listaVendas.innerHTML += `<li>${venda.cliente} comprou o curso ${venda.curso}</li>`;
        });
    }

    // Exibir detalhes do curso selecionado
    document.getElementById('cursoSelectDetalhe').addEventListener('change', function () {
        const cursoIndex = this.value;
        const curso = cursos[cursoIndex];
        const detalhesCurso = document.getElementById('detalhesCurso');

        if (curso) {
            detalhesCurso.innerHTML = `
                <h3>Detalhes do Curso Selecionado:</h3>
                <p><strong>Nome:</strong> ${curso.nome}</p>
                <p><strong>Carga Horária:</strong> ${curso.carga} horas</p>
                <p><strong>Valor:</strong> R$ ${curso.valor}</p>
            `;
            detalhesCurso.style.display = 'block';
        } else {
            detalhesCurso.style.display = 'none';
            detalhesCurso.innerHTML = "";
        }
    });

    // Busca por CPF
    document.getElementById('buscaCPFForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cpfBusca = document.getElementById('cpfBusca').value.trim().replace(/\D/g, '');
        const resultadoBusca = document.getElementById('resultadoBusca');
        resultadoBusca.innerHTML = '';

        if (!cpfBusca) {
            alert("Digite um CPF válido.");
            return;
        }

        const vendasFiltradas = vendas.filter(v => v.cpf.replace(/\D/g, '') === cpfBusca);

        if (vendasFiltradas.length === 0) {
            resultadoBusca.innerHTML = `<li>Nenhuma venda encontrada para o CPF ${cpfBusca}.</li>`;
            return;
        }

        vendasFiltradas.forEach(venda => {
            resultadoBusca.innerHTML += `<li>Cliente: ${venda.cliente} - Curso: ${venda.curso}</li>`;
        });
    });

    function atualizarSelecaoCursosDetalhe() {
        const selectCurso = document.getElementById('cursoSelectDetalhe');
        selectCurso.innerHTML = "<option value=''>Selecione um curso</option>";
        cursos.forEach((curso, index) => {
            selectCurso.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    function atualizarCursosParaClientes() {
        const selectCursoCliente = document.getElementById('cursoCliente');
        selectCursoCliente.innerHTML = "<option value=''>Selecione um curso</option>";
        cursos.forEach((curso, index) => {
            selectCursoCliente.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    atualizarSelecaoCursosDetalhe();
    atualizarCursosParaClientes();
    atualizarSelecaoClientes();
    atualizarVendas();
});