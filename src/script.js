

const bancoInicial = {
    "20260001": {
        op: "20260001",
        produto: "CAMISETA MOVE HEART",
        descricao: "CAMISETA MOVE HEART AZUL MARINHO",
        dataEmissao: "2026-03-24",
        planejado: 1000,
        produzido: 650,
        saldo: 350,
        setor: "Corte"
    }
};


if (!localStorage.getItem("ops")) {
    localStorage.setItem(
        "ops",
        JSON.stringify(bancoInicial)
    );
}



function show(id) {
    document
        .querySelectorAll('.screen')
        .forEach(s => s.classList.remove('active'));

    document
        .getElementById(id)
        .classList.add('active');
}



function login() {

    const m = document
        .getElementById('matricula')
        .value
        .trim();

    const s = document
        .getElementById('senha')
        .value
        .trim();

    if (!m || !s) {
        alert('Informe matrícula e senha');
        return;
    }

    document.getElementById('operatorName').innerText =
        'Operador: ' + m;

    show('dashboard');
}



function consultar() {

    const codigo = document
        .getElementById('codigoConsulta')
        .value
        .trim();

    if (!codigo) {
        alert('Informe a OP');
        return;
    }

    const banco = JSON.parse(
        localStorage.getItem("ops")
    );

    const dados = banco[codigo];

    if (!dados) {
        alert("OP não encontrada.");
        return;
    }

    document.getElementById(
        'consultaResultado'
    ).innerHTML = `
    
    <div class="card" style="margin-top:15px">

        <div class="info"><b>OP:</b> ${dados.op}</div>

        <div class="info">
            <b>Produto:</b> ${dados.produto}
        </div>

        <div class="info">
            <b>Descrição:</b> ${dados.descricao}
        </div>

        <div class="info">
            <b>Data de Emissão:</b> ${dados.dataEmissao}
        </div>

        <div class="info">
            <b>Planejado:</b> ${dados.planejado}
        </div>

        <div class="info">
            <b>Produzido:</b> ${dados.produzido}
        </div>

        <div class="info">
            <b>Saldo:</b> ${dados.saldo}
        </div>

        <div class="info">
            <b>Setor Atual:</b> ${dados.setor}
        </div>

    </div>
    `;
}



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
    
