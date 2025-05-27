const cursos = [];
const clientes = [];
const vendas = [];

const ERROS = {
    cursoExistente: "Este curso já foi cadastrado.",
    cursoNaoSelecionado: "Selecione um curso.",
    clienteNaoSelecionado: "Selecione um cliente.",
    cursoNaoEncontrado: "Curso do cliente não encontrado.",
    nenhumaVenda: "Nenhuma venda encontrada para o CPF."
};

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const mainContent = document.getElementById("mainContent");

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("show");
        mainContent.classList.toggle("shifted", sidebar.classList.contains("show"));
    });

    const cpfInputs = [document.getElementById("clienteCPF"), document.getElementById("cpfBusca")];
    cpfInputs.forEach((input) => {
        input.addEventListener("input", () => {
            const oldValue = input.value;
            input.value = oldValue.replace(/\D/g, '').slice(0, 11);

            const posInicio = input.selectionStart;
            const newLength = input.value.length;
            const oldLength = oldValue.length;
            let posCorrigida = posInicio + (newLength - oldLength);
            if (posCorrigida < 0) posCorrigida = 0;
            input.setSelectionRange(posCorrigida, posCorrigida);
        });
    });

    const menuLinks = document.querySelectorAll("nav#sidebar ul li a");
    const tabs = document.querySelectorAll("main section.tab-content");

    menuLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.dataset.tab;
            if (!target) return;

            menuLinks.forEach((l) => l.classList.remove("active"));
            tabs.forEach((t) => t.classList.remove("active"));

            link.classList.add("active");
            document.getElementById(target).classList.add("active");

            sidebar.classList.remove("show");
            mainContent.classList.remove("shifted");
        });
    });

    document.getElementById("cursoForm").addEventListener("submit", cadastrarCurso);
    document.getElementById("clienteForm").addEventListener("submit", cadastrarCliente);
    document.getElementById("vendaForm").addEventListener("submit", registrarVenda);
    document.getElementById("cursoSelectDetalhe").addEventListener("change", mostrarDetalhesCurso);
    document.getElementById("buscaCPFForm").addEventListener("submit", buscarVendasPorCPF);
    document.getElementById("clienteSelect").addEventListener("change", preencherCursoVenda);

    atualizarCursos();
    atualizarClientes();
});

function cadastrarCurso(e) {
    e.preventDefault();
    const nome = document.getElementById("cursoNome").value.trim();
    const carga = document.getElementById("cursoCarga").value.trim();
    const valorRaw = document.getElementById("cursoValor").value.trim();
    const valor = valorRaw.replace(",", ".");

    if (cursos.some((c) => c.nome.toLowerCase() === nome.toLowerCase())) {
        alert(ERROS.cursoExistente);
        return;
    }

    if (isNaN(parseFloat(valor))) {
        alert("Valor inválido.");
        return;
    }

    cursos.push({
        nome,
        carga,
        valor: parseFloat(valor).toFixed(2).replace(".", ","),
    });

    atualizarCursos();
    limparFormCurso();
}

function cadastrarCliente(e) {
    e.preventDefault();
    const nome = document.getElementById("clienteNome").value.trim();
    const cpfInput = document.getElementById("clienteCPF");
    const cpf = cpfInput.value.trim();

    const cpfLimpo = cpf.replace(/\D/g, "");

    let cliente = clientes.find((c) => c.cpf === cpfLimpo);
    if (!cliente) {
        cliente = { nome, cpf: cpfLimpo };
        clientes.push(cliente);
    }

    atualizarClientes();
    limparFormCliente();
}

function registrarVenda(e) {
    e.preventDefault();
    const clienteIndex = document.getElementById("clienteSelect").value;
    const cursoNome = document.getElementById("cursoInputVenda").value;
    const periodo = document.getElementById("periodoVenda").value.trim();
    const periodoSelect = document.getElementById("periodoVenda");

    if (clienteIndex === "") {
        alert(ERROS.clienteNaoSelecionado);
        return;
    }

    if (cursoNome === "") {
        alert(ERROS.cursoNaoSelecionado);
        return;
    }

    if (periodo === "") {
        alert("Selecione um período válido.");
        periodoSelect.classList.add("error");
        return;
    } else {
        periodoSelect.classList.remove("error");
    }

    const cliente = clientes[clienteIndex];

    const vendaMesmoCurso = vendas.some(
        (v) => v.cpf === cliente.cpf && v.curso === cursoNome && v.periodo === periodo
    );
    if (vendaMesmoCurso) {
        alert("Este cliente já comprou este curso para o período informado.");
        return;
    }

    const vendaMesmoPeriodo = vendas.some(
        (v) => v.cpf === cliente.cpf && v.periodo === periodo && v.curso !== cursoNome
    );
    if (vendaMesmoPeriodo) {
        alert("Este cliente já está matriculado em outro curso neste mesmo período.");
        return;
    }

    vendas.push({
        cliente: cliente.nome,
        cpf: cliente.cpf,
        curso: cursoNome,
        periodo,
    });

    limparFormVenda();
}


function preencherCursoVenda() {
    const clienteIndex = this.value;
    const cursoInput = document.getElementById("cursoInputVenda");
    const periodoSelect = document.getElementById("periodoVenda");

    if (clienteIndex === "") {
        cursoInput.value = "";
        periodoSelect.value = "";
        return;
    }

    const cliente = clientes[clienteIndex];
    const vendasCliente = vendas
        .filter((v) => v.cpf === cliente.cpf)
        .slice()
        .reverse();

    if (vendasCliente.length) {
        cursoInput.value = vendasCliente[0].curso;
        periodoSelect.value = vendasCliente[0].periodo;
    } else {
        cursoInput.value = "";
        periodoSelect.value = "";
    }
}

function mostrarDetalhesCurso() {
    const cursoIndex = this.value;
    const detalhes = document.getElementById("detalhesCurso");

    if (cursoIndex === "") {
        detalhes.style.display = "none";
        detalhes.innerHTML = "";
        return;
    }

    const curso = cursos[cursoIndex];
    if (curso) {
        detalhes.innerHTML = `
            <h3>Detalhes do Curso Selecionado</h3>
            <p><strong>Nome:</strong> ${curso.nome}</p>
            <p><strong>Carga Horária:</strong> ${curso.carga} horas</p>
            <p><strong>Valor:</strong> R$ ${curso.valor}</p>
        `;
        detalhes.style.display = "block";
    } else {
        detalhes.style.display = "none";
        detalhes.innerHTML = "";
    }
}

function buscarVendasPorCPF(e) {
    e.preventDefault();
    const cpfRaw = document.getElementById("cpfBusca").value.trim();
    const cpf = cpfRaw.replace(/\D/g, "");
    const resultado = document.getElementById("resultadoBusca");
    resultado.innerHTML = "";

    const vendasFiltradas = vendas.filter((v) => v.cpf === cpf);

    if (!vendasFiltradas.length) {
        resultado.innerHTML = `<li>${ERROS.nenhumaVenda}: ${cpf}</li>`;
        return;
    }

    vendasFiltradas.forEach((v) => {
        resultado.innerHTML += `<li><strong>Cliente:</strong> ${v.cliente} | <strong>Curso:</strong> ${v.curso} | <strong>Período:</strong> ${v.periodo}</li>`;
    });
}

function atualizarCursos() {
    const cursoSelectDetalhe = document.getElementById("cursoSelectDetalhe");
    const cursoInputVenda = document.getElementById("cursoInputVenda");
    cursoSelectDetalhe.innerHTML = "<option value=''>Selecione um curso</option>";
    cursoInputVenda.innerHTML = "<option value=''>Selecione um curso</option>";

    cursos.forEach((curso, index) => {
        const option = `<option value="${index}">${curso.nome}</option>`;
        cursoSelectDetalhe.innerHTML += option;
        cursoInputVenda.innerHTML += `<option value="${curso.nome}">${curso.nome}</option>`;
    });
}

function atualizarClientes() {
    const clienteSelect = document.getElementById("clienteSelect");
    clienteSelect.innerHTML = "<option value=''>Selecione um cliente</option>";

    clientes.forEach((cliente, index) => {
        clienteSelect.innerHTML += `<option value="${index}">${cliente.nome}</option>`;
    });
}

function limparFormCurso() {
    document.getElementById("cursoNome").value = "";
    document.getElementById("cursoCarga").value = "";
    document.getElementById("cursoValor").value = "";
}

function limparFormCliente() {
    document.getElementById("clienteNome").value = "";
    document.getElementById("clienteCPF").value = "";
}

function limparFormVenda() {
    document.getElementById("clienteSelect").value = "";
    document.getElementById("cursoInputVenda").value = "";
    document.getElementById("periodoVenda").value = "";
    document.getElementById("periodoVenda").classList.remove("error");
}