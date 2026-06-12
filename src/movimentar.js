
async function movimentar() {
    const botao = document.getElementById('btnMov')
    const ok = document.getElementById('ok')
    const erro = document.getElementById('erro')

    const dadosOp = JSON.parse(sessionStorage.getItem('dados_op_atual'))

    if (!dadosOp || !dadosOp.tarefas_ativas || dadosOp.tarefas_ativas.length === 0) {
        if (erro) {
            erro.innerText = 'Busque uma OP válida antes de movimentar.';
            erro.style.display = 'block';
        }
        return;
    }

    const tarefaAtual = dadosOp.tarefas_ativas[0]
    const proximaTarefa = dadosOp.tarefas_ativas[1]

    const op = document.getElementById('op').value.trim()
    const quantidade = parseInt(document.getElementById('quantidade').value)
    const produto = document.getElementById('produto').value.trim()
    const proximaTarefa = document.getElementById('proxima_tarefa').value.trim()
    const TarefaAtual = document.getElementById('tarefa_atual').value.trim()
    const recurso = document.getElementById('proximo_recurso').value.trim()
    const proximaFase = document.getElementById('proxima_fase').value.trim()
    const proximoSetor = document.getElementById('proximo_setor').value.trim()
    const

    // const origem = document.getElementById('origem').value.trim()
    // const destino = document.getElementById('destino').value.trim()


    if (!op || !destino) {
        if (erro) {
            erro.innerText = 'Selecione o setor de destino para movimentar.';
            erro.style.display = 'block';
        }
        return;
    }

    if (origem === destino) {
        if (erro) {
            erro.innerText = 'O destino não pode ser igual ao setor atual.';
            erro.style.display = 'block';
        }
        return;
    }

    const linhasCabecalhos = dadosOp.cabecalho

    const linhasTarefaAtual = linhasCabecalhos

    const linhasDaTarefaAtual = linhasCabecalhos.filter(linha => {
        return String(linha.TAREFA) === String(tarefaAtual.TAREFA);
    });



    // Se por acaso o banco não trouxer grade para essa tarefa, não deixa enviar vazio
    if (linhasDaTarefaAtual.length === 0) {
        if (erro) {
            erro.innerText = `Nenhuma grade encontrada no cabeçalho para a Tarefa ${tarefaAtual.TAREFA}.`;
            erro.style.display = 'block';
        }
        return;
    }

    let totalGeralMovimentado = 0

    const itensGradesMapeados = linhasDaTarefaAtual.map(linha => {
        // Soma todos os tamanhos da linha para saber o total desta cor
        const totalPecasCor = (parseInt(linha.O1) || 0) + (parseInt(linha.O2) || 0) + 
            (parseInt(linha.O3) || 0) + (parseInt(linha.O4) || 0) + 
            (parseInt(linha.O5) || 0) + (parseInt(linha.O6) || 0) + 
            (parseInt(linha.O7) || 0) + (parseInt(linha.O8) || 0) + 
            (parseInt(linha.O9) || 0) + (parseInt(linha.O10) || 0) + 
            (parseInt(linha.O11) || 0) + (parseInt(linha.O12) || 0) + 
            (parseInt(linha.O13) || 0) + (parseInt(linha.O14) || 0) + 
            (parseInt(linha.O15) || 0) + (parseInt(linha.O16) || 0);
            
            totalGeralMovimentado += totalPecasCor
            return {
                cor: linha.COR_PRODUTO,
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
        }

    const payload = {
        "produto": linhasCabecalhos.produto,
        "ordem_producao": dadosOp.ordem_producao,
        "tarefa": proximaTarefa,
        "tarefa_anterior": TarefaAtual,
        "quantidade_movimentada_total": totalGeralMovimentado,
        "recurso_produtivo": recurso,
        "fase_producao": proximaFase,
        "setor_producao": proximoSetor,
        "itens_grades": itensGradesMapeados
    }
    })

    const token = localStorage.getItem('token')

    if (botao) {
        botao.disabled = true;
        botao.innerHTML = 'Processando'
    }


    

    try {
        const envio = await fetch(`${API_URL}/movimentarop`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
        )

        const resposta = await envio.json()

        if (!envio.ok) {
            throw new Error(resposta.detail || 'Erro ao processar a movimentação')
        }

        if (ok) {
            ok.innerText = 'Movimentação registrada'
            ok.style.display = 'block'
        }
    }
    catch (erro) {
        console.error('Erro na moventação', erro)
        if (erro) {
            erro.innerText = `${erro.message}`
            erro.style.display = 'block'
        }


    }

    finally {
        if (botao) {
            botao.disabled = false;
            botao.innerText = 'Confirmar Movimentação'
        }
    }

    }
