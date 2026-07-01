const API_URL = "http://192.168.0.138:8000";


async function login() {
    const usuario = document.getElementById('matricula').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!usuario || !senha) {
        alert('Informe o usuário e senha');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, senha: senha })
        });

        const dados = await response.json();

        if (!response.ok) {
            throw new Error(dados.detail || 'Erro ao realizar login');
        }

        localStorage.setItem('token', dados.token);
        localStorage.setItem('usuario', usuario);

        document.getElementById('operatorName').innerText = 'Operador: ' + usuario;
        show('dashboard');

    } catch (erro) {
    console.error("Erro no login:", erro);

    alert("Usuário ou senha inválidos");

    // if (caixaErro) {
    //     caixaErro.innerText = erro.message.includes("404") || erro.message.includes("OP")
    //         ? "Número de OP não encontrada"
    //         : erro.message || "Erro ao consultar OP";

    //     caixaErro.style.display = 'block';
    // }

    limparConsulta();
}
    }


function show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
    }
}

async function consultar() {
    const caixaErro = document.getElementById('erro');
if (caixaErro) {
    caixaErro.style.display = 'none';
    caixaErro.innerText = '';
}
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

        let produto = 'Não informado';
        let desc = 'Não informada';
        let tarefa = 'Nenhuma tarefa pendente';
        let setor = 'Finalizado';

        // ADICIONADO
        let faseProducao = '';
        let descFaseProducao = '';
        let recurso = '';
        let descRecurso = '';
        let qtdPrevista = 0;
        let qtdEmProcesso = 0;
        
        
        if (dados.cabecalho && Array.isArray(dados.cabecalho) && dados.cabecalho.length > 0 && dados.cabecalho[0]) {
            const cb = dados.cabecalho[0];
            produto = cb.PRODUTO;
            desc = cb.DESC_PRODUTO;
        }

        // Validação rigorosa da Tarefa Ativa (Evita o erro do DESC_SETOR_PRODUCAO)
       if (dados.tarefas_ativas && Array.isArray(dados.tarefas_ativas) && dados.tarefas_ativas.length > 0 && dados.tarefas_ativas[0]) {
        const ta = dados.tarefas_ativas[0];

        tarefa = ta.TAREFA;
        setor = ta.DESC_SETOR_PRODUCAO;

        // ADICIONADO
        faseProducao = ta.FASE_PRODUCAO;
        descFaseProducao = ta.DESC_FASE_PRODUCAO;
        recurso = ta.RECURSO_PRODUTIVO;
        descRecurso = ta.DESC_RECURSO;

        qtdPrevista = ta.QTDE_PREVISTA;
        qtdEmProcesso = ta.QTDE_EM_PROCESSO;
    }

        // if (resultadodiv) {
        //     resultadodiv.innerHTML = `
        //         <div class="card" style="margin-top:15px; border-left: 5px solid #0e121a;">
        //             <div class="info"><b>OP:</b> ${dados.ordem_producao || op}</div>
        //             <div class="info"><b>Referência:</b> ${produto}</div>
        //             <div class="info"><b>Produto:</b> ${desc}</div>
        //             <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #ddd;">
        //            <div class="info"><b>Tarefa Atual:</b> ${tarefa}</div>
        //            <div class="info"><b>Tarefa Atual:</b> ${tarefa}</div>
        //             <div class="info"><b>Setor Atual:</b> ${setor}</div>
        //             <div class="info"><b>Fase Produção:</b> ${faseProducao}</div>
        //             <div class="info"><b>Descrição da Fase:</b> ${descFaseProducao}</div>
        //             <div class="info"><b>Recurso Produtivo:</b> ${recurso}</div>
        //             <div class="info"><b>Descrição do Recurso:</b> ${descRecurso}</div>

        //             <div class="info"><b>Qtd Prevista:</b> ${qtdPrevista}</div>
        //             <div class="info"><b>Qtd Em Processo:</b> ${qtdEmProcesso}</div>
        //         </div>`;
        // }
        
        const tarefaAtual = dados.tarefas_ativas[0];
        const proximaTarefa = dados.tarefas_ativas[1];
        

        const cabecalho = dados.cabecalho[0];
        // preenchimento dos campos do formulário de movimentação
        document.getElementById('op').value = dados.ordem_producao;
        document.getElementById('produto').value = cabecalho.PRODUTO;
        document.getElementById('descricao').value = cabecalho.DESC_PRODUTO;
        document.getElementById('origem').value = tarefaAtual.DESC_SETOR_PRODUCAO || '';
        document.getElementById('quantidade').value = tarefaAtual.QTDE_EM_PROCESSO;
        document.getElementById('faseAtual').value =tarefaAtual.DESC_FASE_PRODUCAO || '';
        document.getElementById('recursoAtual').value = tarefaAtual.DESC_RECURSO || '';
        
        if (proximaTarefa) {
            document.getElementById('destino').value = proximaTarefa.DESC_SETOR_PRODUCAO || '';
            document.getElementById('proxima_tarefa').value = proximaTarefa.TAREFA;
            document.getElementById('proxima_fase').value = proximaTarefa.FASE_PRODUCAO;
            document.getElementById('proximo_setor').value = proximaTarefa.SETOR_PRODUCAO;
            document.getElementById('proximo_recurso').value = proximaTarefa.RECURSO_PRODUTIVO || "";
            document.getElementById('faseDestino').value = proximaTarefa.DESC_FASE_PRODUCAO || '';
            document.getElementById('recursoDestino').value = proximaTarefa.DESC_RECURSO || '';
        } else {
            document.getElementById('destino').value = "Fluxo Finalizado";
            document.getElementById('proxima_tarefa').value = "";
            document.getElementById('proxima_fase').value = "";
            document.getElementById('proximo_setor').value = "";
            document.getElementById('proximo_recurso').value = "";
            document.getElementById('faseDestino').value = '';
            document.getElementById('recursoDestino').value = '';
        }

        document.getElementById('tarefa_atual').value = tarefaAtual.TAREFA;

        const dataFormatada = cabecalho.DATA.substring(8, 10) + "/" + cabecalho.DATA.substring(5, 7) + "/" + cabecalho.DATA.substring(0, 4);
        
        document.getElementById('dataEmissao').value = dataFormatada || "";

        sessionStorage.setItem('dados_op_atual', JSON.stringify(dados));
        
    } catch (erro) {
        console.error("Erro detectado na consulta:", erro);

    alert("Número de OP não encontrada");

    // const caixaErro = document.getElementById('erro');

    // if (caixaErro) {
    //     caixaErro.innerText = "Número de OP não encontrada";
    //     caixaErro.style.display = 'block';
    // }

    limparConsulta();
        
    }
}

function alterarTipoConsulta(){

    const tipo = document.getElementById("tipoConsulta").value;

    if(tipo === "fase"){

        document.getElementById("campoTexto").style.display = "none";
        document.getElementById("campoFase").style.display = "block";

    }else{

        document.getElementById("campoTexto").style.display = "block";
        document.getElementById("campoFase").style.display = "none";

    }

}


async function buscarConsulta(){

    const tipo = document.getElementById("tipoConsulta").value;

    

    const token = localStorage.getItem('token');
    
    
    
    try {
        

        let response
        
            if (tipo === "op") {
                op = document.getElementById("valorConsulta").value.trim();
                response = await fetch(`${API_URL}/consultaporop/${op}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            })
            };

            if (tipo === "fase") {
                fase = document.getElementById("consultaFase").value.trim();
                response = await fetch(`${API_URL}/consultaporfase/${fase}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }

            })}

            if (tipo ==="produto") {
                produto = document.getElementById("valorConsulta").value.trim();
                response = await fetch(`${API_URL}/consultaporproduto/${produto}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            
            const dados = await response.json();

            if (!response.ok) {
            throw new Error(dados.detail);
        }
            
            preencherTabela(dados);
            


            
            
            
            
            
            


    }
    catch (erro) {
        console.error("Erro na consulta:", erro);
        alert("Erro ao consultar: " + (erro.message || "Erro desconhecido"));
    }





    // if(tipo === "fase"){
    //     valor = document.getElementById("consultaFase").value;
    // }else{
    //     valor = document.getElementById("valorConsulta").value.trim();
    // }


    console.log("Tipo:", tipo);
    console.log("Valor:", valor);

// aqui depois iremos chamar o backend
}

  function statusPorEmissao(dataEmissaoStr) {
    const hoje = new Date();
    const emissao = new Date(dataEmissaoStr);
    const diffDias = Math.floor((hoje - emissao) / (1000 * 60 * 60 * 24));

    if (diffDias <= 0) {
        return { classe: 'status-azul', titulo: `${diffDias} dia(s) desde a emissão` };
    }
    if (diffDias <= 7) {
        return { classe: 'status-verde', titulo: `${diffDias} dia(s) desde a emissão` };
    }
    if (diffDias <= 15) {
        return { classe: 'status-amarelo', titulo: `${diffDias} dia(s) desde a emissão` };
    }
    if (diffDias <= 30) {
        return { classe: 'status-vermelho', titulo: `${diffDias} dia(s) desde a emissão` };
    }
    return { classe: 'status-preto', titulo: `${diffDias} dia(s) desde a emissão` };
}

function preencherTabela(dados) {
    const tbody = document.getElementById("resultadoConsulta");
    document.querySelector(".tabela-consulta").style.display = "";
    
    
    tbody.innerHTML = "";

    let totalEmProducao = 0;


    dados.forEach(item => {
    const linha = document.createElement("tr");
    const status = statusPorEmissao(item.EMISSAO);

    linha.innerHTML = `
    <td><span class="status-dot ${status.classe}" title="${status.titulo}"></span></td>
    <td>${item.EMISSAO.substring(8, 10) + "/" + item.EMISSAO.substring(5, 7) + "/" + item.EMISSAO.substring(0, 4)}</td>
    <td>${item.ORDEM_PRODUCAO}</td>
    <td>${item.REFERENCIA}</td>
    <td>${item.ORIGINAL}</td>   
    <td>${item.EM_PRODUCAO}</td>
    `;

    tbody.appendChild(linha);

    totalEmProducao += item.EM_PRODUCAO

    document.getElementById("totalEmProducao").value = totalEmProducao;

});



}

async function movimentar() {
    const botao = document.getElementById('btnMov');
    const caixaOk = document.getElementById('ok');
    const caixaErro = document.getElementById('erro');

    if (caixaOk) caixaOk.style.display = 'none';
    if (caixaErro) caixaErro.style.display = 'none';

    const dadosOp = JSON.parse(sessionStorage.getItem('dados_op_atual'));

    if (!dadosOp || !dadosOp.tarefas_ativas || dadosOp.tarefas_ativas.length === 0) {
        if (caixaErro) {
            caixaErro.innerText = 'Busque uma OP válida antes de movimentar.';
            caixaErro.style.display = 'block';
        }
        return;
    }


    const tarefaAtualDoBanco = dadosOp.tarefas_ativas[0];

    // Captura dos elementos do DOM de forma limpa e sem duplicar variáveis
    const op = document.getElementById('op').value.trim();
    const quantidade = parseInt(document.getElementById('quantidade').value) || 0;
    const produto = document.getElementById('produto').value.trim();
    const valorProximaTarefa = document.getElementById('proxima_tarefa').value.trim();
    const valorTarefaAtual = document.getElementById('tarefa_atual').value.trim();
    const recurso = document.getElementById('proximo_recurso').value.trim();
    const proximaFase = document.getElementById('proxima_fase').value.trim();
    const proximoSetor = document.getElementById('proximo_setor').value.trim();
    
    const origem = document.getElementById('origem').value.trim();
    const destino = document.getElementById('destino').value.trim();

    if (!op || !destino) {
        if (caixaErro) {
            caixaErro.innerText = 'Selecione o setor de destino para movimentar.';
            caixaErro.style.display = 'block';
        }
        return;
    }

    if (origem === destino) {
        if (caixaErro) {
            caixaErro.innerText = 'O destino não pode ser igual ao setor atual.';
            caixaErro.style.display = 'block';
        }
        return;
    }

    const linhasCabecalhos = dadosOp.cabecalho || [];
    
    // Filtra as grades correspondentes do cabeçalho baseado na tarefa atual
    const linhasDaTarefaAtual = linhasCabecalhos.filter(linha => {
        return String(linha.TAREFA).trim() === String(tarefaAtualDoBanco.TAREFA).trim();
    });

    if (linhasDaTarefaAtual.length === 0) {
        if (caixaErro) {
            caixaErro.innerText = `Nenhuma grade encontrada no cabeçalho para a Tarefa ${tarefaAtualDoBanco.TAREFA}.`;
            caixaErro.style.display = 'block';
        }
        return;
    }

    let totalGeralMovimentado = 0;

    // O .map() executa e fecha corretamente gerando a lista de itens
    const itensGradesMapeados = linhasDaTarefaAtual.map(linha => {
        const totalPecasCor = (parseInt(linha.O1) || 0) + (parseInt(linha.O2) || 0) + 
            (parseInt(linha.O3) || 0) + (parseInt(linha.O4) || 0) + 
            (parseInt(linha.O5) || 0) + (parseInt(linha.O6) || 0) + 
            (parseInt(linha.O7) || 0) + (parseInt(linha.O8) || 0) + 
            (parseInt(linha.O9) || 0) + (parseInt(linha.O10) || 0) + 
            (parseInt(linha.O11) || 0) + (parseInt(linha.O12) || 0) + 
            (parseInt(linha.O13) || 0) + (parseInt(linha.O14) || 0) + 
            (parseInt(linha.O15) || 0) + (parseInt(linha.O16) || 0);
            
        totalGeralMovimentado += totalPecasCor;


        console.log(linha.COR_PRODUTO);
        console.log(totalPecasCor);

         console.log({ cor: linha.COR_PRODUTO.trim(),
            quantidade_cor: totalPecasCor,
            T1: parseInt(linha.O1) || 0,
            T2: parseInt(linha.O2) || 0,
            T3: parseInt(linha.O3) || 0,
            T4: parseInt(linha.O4) || 0,
            T5: parseInt(linha.O5) || 0,
            T6: parseInt(linha.O6) || 0,
            T7: parseInt(linha.O7) || 0,
            T8: parseInt(linha.O8) || 0,
            T9: parseInt(linha.O9) || 0,
            T10: parseInt(linha.O10) || 0,
            T11: parseInt(linha.O11) || 0,
            T12: parseInt(linha.O12) || 0,
            T13: parseInt(linha.O13) || 0,
            T14: parseInt(linha.O14) || 0,
            T15: parseInt(linha.O15) || 0,
            T16: parseInt(linha.O16) || 0})


        return {
            cor: linha.COR_PRODUTO.trim(),
            quantidade_cor: totalPecasCor,
            T1: parseInt(linha.O1) || 0,
            T2: parseInt(linha.O2) || 0,
            T3: parseInt(linha.O3) || 0,
            T4: parseInt(linha.O4) || 0,
            T5: parseInt(linha.O5) || 0,
            T6: parseInt(linha.O6) || 0,
            T7: parseInt(linha.O7) || 0,
            T8: parseInt(linha.O8) || 0,
            T9: parseInt(linha.O9) || 0,
            T10: parseInt(linha.O10) || 0,
            T11: parseInt(linha.O11) || 0,
            T12: parseInt(linha.O12) || 0,
            T13: parseInt(linha.O13) || 0,
            T14: parseInt(linha.O14) || 0,
            T15: parseInt(linha.O15) || 0,
            T16: parseInt(linha.O16) || 0
        };
    });

    // O payload agora está isolado, estruturado e mapeando as propriedades em maiúsculo de linhasCabecalhos
    const payload = {
        "produto": produto,
        "ordem_producao": dadosOp.ordem_producao,
        "tarefa": valorProximaTarefa,
        "tarefa_anterior": valorTarefaAtual,
        "sequencia_produtiva": String(tarefaAtualDoBanco.SEQUENCIA_PRODUTIVA || "0"),
        "quantidade_movimentada_total": tarefaAtualDoBanco.QTDE_EM_PROCESSO,
        "recurso_produtivo": recurso || "PADRAO",
        "fase_producao": proximaFase,
        "setor_producao": proximoSetor,
        "itens_grades": itensGradesMapeados
    };

    const token = localStorage.getItem('token');

    if (botao) {
        botao.disabled = true;
        botao.innerHTML = 'Processando...';
    }

    try {
        const envio = await fetch(`${API_URL}/movimentarop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const resposta = await envio.json();

        if (!envio.ok) {
            throw new Error(resposta.detail || 'Erro ao processar a movimentação');
        }

        alert('OP Movimentada com sucesso!');
    }
    catch (err) {
        console.error('Erro na movimentação', err);
        alert("Erro na movimentação")

        if (caixaErro) {
            caixaErro.innerText = `${err.message}`;
            caixaErro.style.display = 'block';
        }
    }
    finally {
        if (botao) {
            botao.disabled = false;
            botao.innerText = 'Confirmar Movimentação';
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
        document.getElementById('operatorName').innerText = 'Operador: ' + usuario;
        show('dashboard');
    } else {
        show('login');
    }
});
    // ENTER NO LOGIN
    const senha = document.getElementById('senha');

    if (senha) {
        senha.addEventListener('keydown', function(e){

            if(e.key === 'Enter'){
                e.preventDefault();
                login();
            }

        });
    }

    // ENTER NA CONSULTA DE MOVIMENTAÇÃO
    const codigoConsulta = document.getElementById('codigoConsulta');

    if (codigoConsulta) {
        codigoConsulta.addEventListener('keydown', function(e){

            if(e.key === 'Enter'){
                e.preventDefault();
                consultar();
            }

        });
    }

    // ENTER NA TELA DE CONSULTA
    ['valorConsulta', 'consultaFase'].forEach(id => {

    const campo = document.getElementById(id);

    if (campo) {
        campo.addEventListener('keydown', function(e){

            if(e.key === 'Enter'){
                e.preventDefault();
                buscarConsulta();
            }

        });
    }

});


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('dados_op_atual');
    
    document.getElementById('operatorName').innerText = 'Não autenticado: ';
    show('login');


}

function limparConsultaProducao(){

    
    document.getElementById("valorConsulta").value = "";
    document.getElementById("consultaFase").value = "";
    document.getElementById("totalEmProducao").value = "";

    
    document.getElementById("resultadoConsulta").innerHTML = "";

    document.querySelector(".tabela-consulta").style.display = "none";

}

function limparConsulta() {
    document.getElementById('codigoConsulta').value = '';
    document.getElementById('op').value = '';
    document.getElementById('produto').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('origem').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('faseAtual').value = '';
    document.getElementById('recursoAtual').value = '';
    document.getElementById('dataEmissao').value = '';
        
        
    document.getElementById('destino').value =  '';
    document.getElementById('proxima_tarefa').value = ''
    document.getElementById('proxima_fase').value = ''
    document.getElementById('proximo_setor').value = ''
    document.getElementById('proximo_recurso').value =  '';
    document.getElementById('faseDestino').value =  '';
    document.getElementById('recursoDestino').value =  '';


}