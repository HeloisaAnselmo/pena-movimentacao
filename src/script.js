

// const bancoInicial = {
//     "20260001": {
//         op: "20260001",
//         produto: "CAMISETA MOVE HEART",
//         descricao: "CAMISETA MOVE HEART AZUL MARINHO",
//         dataEmissao: "2026-03-24",
//         planejado: 1000,
//         produzido: 650,
//         saldo: 350,
//         setor: "Corte"
//     }
// };


// if (!localStorage.getItem("ops")) {
//     localStorage.setItem(
//         "ops",
//         JSON.stringify(bancoInicial)
//     );
// }


const API_URL = "http://192.168.0.138:8000"

async function login() {

    const usuario = document.getElementById('matricula').value.trim()
    const senha = document.getElementById('senha').value.trim()
    

    if (!usuario || !senha){
        alert('Informe o usuário e senha')
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({usuario: usuario, senha: senha})
        })

        const dados = await response.json()

        if (!response.ok) {
            throw new Error(dados.detail || 'Erro ao realizar login')
        }


        localStorage.setItem('token', dados.token)
        localStorage.setItem('usuario', usuario)

        document.getElementById('operatorName').innerText = 'Operador: ' + usuario;
        show('dashboard')

 

    }

    catch (erro) {
        alert(erro.message)
    }

}


function show(id) {
    document
        .querySelectorAll('.screen')
        .forEach(s => s.classList.remove('active'));

    document
        .getElementById(id)
        .classList.add('active');
}



// function login() {

//     const m = document
//         .getElementById('matricula')
//         .value
//         .trim();

//     const s = document
//         .getElementById('senha')
//         .value
//         .trim();

//     if (!m || !s) {
//         alert('Informe matrícula e senha');
//         return;
//     }

//     document.getElementById('operatorName').innerText =
//         'Operador: ' + m;

//     show('dashboard');
// }



async function consultar() {
    // Busca o valor do campo de consulta de forma segura
    const inputConsulta = document.getElementById('codigoConsulta') || document.getElementById('op');
    const op = inputConsulta ? inputConsulta.value.trim() : "";

    if (!op) {
        alert('Informe a OP');
        return;
    }

    const token = localStorage.getItem('token');
    const resultadodiv = document.getElementById('consultaResultado');

    try {
        const response = await fetch(`${API_URL}/consultaop/${op}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const dados = await response.json();
        if (!response.ok) {
            throw new Error(dados.detail || 'Erro ao consultar OP');
        }

        // Criando variáveis nulas por padrão para evitar "undefined"
        let produto = 'Não informado';
        let cor = 'Não informada';
        let tarefa = 'Nenhuma tarefa pendente';
        let setor = 'Finalizado';
        let qtdPrevista = 0;
        let qtdEmProcesso = 0;

        // Validação rigorosa do Cabeçalho
        if (dados.cabecalho && Array.isArray(dados.cabecalho) && dados.cabecalho.length > 0 && dados.cabecalho[0]) {
            const cb = dados.cabecalho[0];
            produto = cb.PRODUTO
            cor = cb.COR_PRODUTO
        }

        // Validação rigorosa da Tarefa Ativa (Evita o erro do DESC_SETOR_PRODUCAO)
        if (dados.tarefas_ativas && Array.isArray(dados.tarefas_ativas) && dados.tarefas_ativas.length > 0 && dados.tarefas_ativas[0]) {
            const ta = dados.tarefas_ativas[0];
            tarefa = ta.TAREFA
            setor = ta.DESC_SETOR_PRODUCAO 
            qtdPrevista = ta.QTDE_PREVISTA
            qtdEmProcesso = ta.QTDE_EM_PROCESSO
        }

        
        if (resultadodiv) {
            resultadodiv.innerHTML = `
                <div class="card" style="margin-top:15px; border-left: 5px solid #0e121a;">
                    <div class="info"><b>OP:</b> ${dados.ordem_producao || op}</div>
                    <div class="info"><b>Referência/Produto:</b> ${produto}</div>
                    <div class="info"><b>Cor:</b> ${cor}</div>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #ddd;">
                    <div class="info"><b>Tarefa Atual:</b> ${tarefa}</div>
                    <div class="info"><b>Setor Atual:</b> ${setor}</div>
                    <div class="info"><b>Qtd Prevista:</b> ${qtdPrevista}</div>
                    <div class="info"><b>Qtd Em Processo:</b> ${qtdEmProcesso}</div>
                </div>`;
        }

        // Alimenta os inputs da tela de movimentação apenas se eles existirem na página
        // const inputMovOp = document.getElementById('movOp') || document.getElementById('op');
        // const inputProduto = document.getElementById('produto');
        // const inputDescricao = document.getElementById('descricao');
        // const inputOrigem = document.getElementById('origem');
        // const inputQuantidade = document.getElementById('quantidade');

        // if (inputMovOp) inputMovOp.value = dados.ordem_producao || op;
        // if (inputProduto) inputProduto.value = produto;
        // if (inputDescricao) inputDescricao.value = cor;
        // if (inputOrigem) inputOrigem.value = setor !== 'Finalizado' ? setor : '';
        // if (inputQuantidade) inputQuantidade.value = qtdPrevista;

        sessionStorage.setItem('dados_op_atual', JSON.stringify(dados));

    } catch (erro) {
        console.error("Erro detectado na consulta:", erro);
        if (resultadodiv) {
            resultadodiv.innerHTML = `
                <div class="error" style="display:block; margin-top:15px; color: black; font-weight: bold;">
                    ⚠️ ${erro.message}
                </div>`;
        }
    }
}

    // // const banco = JSON.parse(
    // //     localStorage.getItem("ops")
    // // );

    // const dados = banco[codigo];

    // if (!dados) {
    //     alert("OP não encontrada.");
    //     return;
    // }

    // document.getElementById(
    //     'consultaResultado'
    // ).innerHTML = `
    
    // <div class="card" style="margin-top:15px">

    //     <div class="info"><b>OP:</b> ${dados.op}</div>

    //     <div class="info">
    //         <b>Produto:</b> ${dados.produto}
    //     </div>

    //     <div class="info">
    //         <b>Descrição:</b> ${dados.descricao}
    //     </div>

    //     <div class="info">
    //         <b>Data de Emissão:</b> ${dados.dataEmissao}
    //     </div>

    //     <div class="info">
    //         <b>Planejado:</b> ${dados.planejado}
    //     </div>

    //     <div class="info">
    //         <b>Produzido:</b> ${dados.produzido}
    //     </div>

    //     <div class="info">
    //         <b>Saldo:</b> ${dados.saldo}
    //     </div>

    //     <div class="info">
    //         <b>Setor Atual:</b> ${dados.setor}
    //     </div>

    // </div>
    // `;



function movimentar() {

    const op = document
        .getElementById('op')
        .value
        .trim();

    const produto = document
        .getElementById('produto')
        .value
        .trim();

    const descricao = document
        .getElementById('descricao')
        .value
        .trim();

    const dataEmissao = document
        .getElementById('dataEmissao')
        .value
        .trim();

    const origem = document
        .getElementById('origem')
        .value
        .trim();

    const destino = document
        .getElementById('destino')
        .value
        .trim();

    const btn = document.getElementById('btnMov');
    const ok = document.getElementById('ok');
    const erro = document.getElementById('erro');

    ok.style.display = 'none';
    erro.style.display = 'none';

    if (
        !op ||
        !produto ||
        !descricao ||
        !origem ||
        !destino
    ) {
        erro.innerText =
            'Não foi possível fazer a movimentação. Campo vazio.';

        erro.style.display = 'block';
        return;
    }

    if (origem === destino) {

        erro.innerText =
            'Destino não pode ser igual ao setor atual.';

        erro.style.display = 'block';
        return;
    }

    const banco = JSON.parse(
        localStorage.getItem("ops")
    );

    if (!banco[op]) {

        banco[op] = {
            op: op,
            produto: produto,
            descricao: descricao,
            dataEmissao: dataEmissao,
            planejado: 0,
            produzido: 0,
            saldo: 0,
            setor: destino
        };

    } else {

        banco[op].produto = produto;
        banco[op].descricao = descricao;
        banco[op].dataEmissao = dataEmissao;
        banco[op].setor = destino;
    }

    localStorage.setItem(
        "ops",
        JSON.stringify(banco)
    );

    btn.disabled = true;
    btn.innerText = 'Processando...';

    setTimeout(() => {

        ok.innerText =
            'Movimentação registrada com sucesso!';

        ok.style.display = 'block';

        document.getElementById('origem').value =
            destino;

        btn.disabled = false;
        btn.innerText =
            'Confirmar Movimentação';

    }, 1500);
}



document
    .getElementById('codigoConsulta')
    .addEventListener('keypress', e => {

        if (e.key === 'Enter') {
            e.preventDefault();
            consultar();
        }

    });
    
