// Guarda o gráfico para atualização
let graficoConsumo = null;

// Guarda o período atualmente selecionado
let periodoAtual = "hoje";


// ================================================================
// BUSCA O CONSUMO TOTAL DO DIA
// ================================================================

async function carregarConsumoHoje() {

    try {

        const resposta = await fetch("/api/consumo/hoje");

        const dados = await resposta.json();

        document.getElementById("consumo").textContent =
            Number(dados.consumoHoje).toFixed(3) + " L";

    } catch (erro) {

        console.error("Erro ao buscar consumo de hoje:", erro);

    }
}


// ================================================================
// BUSCA O CONSUMO TOTAL DO MÊS
// ================================================================

async function carregarConsumoMes() {

    try {

        const resposta = await fetch("/api/consumo/mes");

        const dados = await resposta.json();

        // Verifica se existe um elemento com id consumoMes
        const elemento = document.getElementById("consumoMes");

        if (elemento) {

            elemento.textContent =
                Number(dados.consumoMes).toFixed(3) + " L";
        }

    } catch (erro) {

        console.error("Erro ao buscar consumo do mês:", erro);

    }
}


// ================================================================
// BUSCA A VAZÃO MAIS RECENTE
// ================================================================

async function carregarVazao() {

    try {

        const resposta = await fetch("/api/consumo");

        const dados = await resposta.json();

        if (dados.length > 0) {

            const ultimoRegistro = dados[0];

            document.getElementById("vazao").textContent =
                Number(ultimoRegistro.vazao).toFixed(2) + " L/min";

        } else {

            document.getElementById("vazao").textContent =
                "0.00 L/min";
        }

    } catch (erro) {

        console.error("Erro ao buscar vazão:", erro);

    }
}


// ================================================================
// BUSCA O CUSTO ESTIMADO DO MÊS
// ================================================================

async function carregarCusto() {

    try {

        const resposta =
            await fetch("/api/consumo/custo");

        const dados = await resposta.json();

        document.getElementById("custo").textContent =
            "R$ " +
            Number(dados.total)
                .toFixed(2)
                .replace(".", ",");

    } catch (erro) {

        console.error("Erro ao buscar custo:", erro);

    }
}


// ================================================================
// BUSCA OS DADOS DO HISTÓRICO
// =======================  =========================================

async function carregarHistorico() {

    try {

        const resposta = await fetch(
            `/api/consumo/historico?periodo=${periodoAtual}`
        );

        const dados = await resposta.json();

        const periodos = [];

        const consumos = [];


        // --------------------------------------------------------
        // PERCORRE OS REGISTROS
        // --------------------------------------------------------

        dados.forEach(registro => {

            const data = new Date(registro.periodo);


            // ----------------------------------------------------
            // HOJE
            // ----------------------------------------------------

            if (periodoAtual === "hoje") {

                periodos.push(
                    data.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                );


            // ----------------------------------------------------
            // ÚLTIMOS 7 DIAS
            // ----------------------------------------------------

            } else if (periodoAtual === "7dias") {

                periodos.push(
                    data.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit"
                    })
                );


            // ----------------------------------------------------
            // MÊS
            // ----------------------------------------------------

            } else {

                periodos.push(
                    data.toLocaleDateString("pt-BR")
                );
            }


            // Adiciona o consumo
            consumos.push(
                Number(registro.consumo)
            );

        });


        // ========================================================
        // LOCALIZA O CANVAS
        // ========================================================

        const areaGrafico =
            document.getElementById("graficoConsumo");


        // Se o canvas não existir, não tenta criar o gráfico
        if (!areaGrafico) {

            console.warn(
                "Canvas graficoConsumo não encontrado."
            );

            return;
        }


        // ========================================================
        // ATUALIZA GRÁFICO EXISTENTE
        // ========================================================

        if (graficoConsumo) {

            graficoConsumo.data.labels = periodos;

            graficoConsumo.data.datasets[0].data = consumos;

            graficoConsumo.update();

        }


        // ========================================================
        // CRIA O GRÁFICO
        // ========================================================

        else {

            graficoConsumo = new Chart(
                areaGrafico,
                {

                    type: "line",

                    data: {

                        labels: periodos,

                        datasets: [{

                            label: "Consumo (L)",

                            data: consumos,

                            tension: 0.3
                        }]
                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                title: {

                                    display: true,

                                    text: "Consumo (L)"
                                }
                            },


                            x: {

                                title: {

                                    display: true,

                                    text: "Período"
                                }
                            }
                        }
                    }
                }
            );
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );
    }
}


// ================================================================
// CARREGA TODOS OS DADOS INICIAIS
// ================================================================

async function carregarDashboard() {

    await carregarConsumoHoje();

    await carregarConsumoMes();

    await carregarVazao();

    await carregarCusto();

    await carregarHistorico();
}


// ================================================================
// INICIALIZA O DASHBOARD
// ================================================================

carregarDashboard();


// ================================================================
// SELETOR DE PERÍODO DO HISTÓRICO
// ================================================================

const seletorPeriodo =
    document.getElementById("periodoHistorico");


if (seletorPeriodo) {

    seletorPeriodo.addEventListener(
        "change",
        () => {

            periodoAtual =
                seletorPeriodo.value;

            carregarHistorico();
        }
    );
}


// ================================================================
// ATUALIZAÇÃO AUTOMÁTICA DOS CARDS
// ================================================================

// Atualiza os dados a cada 5 segundos

setInterval(() => {

    carregarConsumoHoje();

    carregarConsumoMes();

    carregarVazao();

    carregarCusto();

}, 5000);


// ================================================================
// ATUALIZAÇÃO DO GRÁFICO
// ================================================================

// Atualiza o histórico a cada 1 minuto

setInterval(() => {

    carregarHistorico();

}, 60000);