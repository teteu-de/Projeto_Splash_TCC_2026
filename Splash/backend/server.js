
const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const logger = require("./logger");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "splash",
  password: process.env.DB_PASSWORD || "Ma.270209",
  port: Number(process.env.DB_PORT || 5432),
});

app.use(cors());
app.use(express.json());

// Registra automaticamente método, rota, status e duração, sem salvar tokens ou corpos.
app.use((req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    logger.request({
      metodo: req.method,
      rota: req.path,
      status: res.statusCode,
      duracaoMs: Date.now() - inicio,
    });
  });
  next();
});

app.use(express.static(path.join(__dirname, "public")));
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET não configurado.");
}

const TOKEN_TTL_SECONDS = 8 * 60 * 60;

function criarToken(usuario) {
  const agora = Math.floor(Date.now() / 1000);

  const payload = Buffer.from(
    JSON.stringify({
      sub: usuario.id,
      email: usuario.email,
      iat: agora,
      exp: agora + TOKEN_TTL_SECONDS,
    })
  ).toString("base64url");

  const assinatura = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${assinatura}`;
}

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || "";
  const [tipo, token] = cabecalho.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      erro: "Faça login para acessar estes dados.",
    });
  }

  const partes = token.split(".");

  if (partes.length !== 2) {
    return res.status(401).json({ erro: "Token inválido." });
  }

  const [payload, assinaturaRecebida] = partes;

  const assinaturaEsperada = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("base64url");

  const a = Buffer.from(assinaturaRecebida);
  const b = Buffer.from(assinaturaEsperada);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ erro: "Token inválido." });
  }

  try {
    const dados = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      !dados.sub ||
      !dados.exp ||
      dados.exp <= Math.floor(Date.now() / 1000)
    ) {
      return res.status(401).json({
        erro: "Sessão expirada. Entre novamente.",
      });
    }

    req.usuarioId = Number(dados.sub);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido." });
  }
}

const categoriasValidas = [
  "vulneravel",
  "social",
  "social2",
  "residencial",
];

// CADASTRO
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nome, email, senha, categoria_tarifaria } = req.body || {};

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof senha !== "string" ||
      senha.length < 8 ||
      !categoriasValidas.includes(categoria_tarifaria)
    ) {
      return res.status(400).json({
        erro:
          "Informe nome, e-mail, senha com pelo menos 8 caracteres e uma categoria tarifária válida.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const senhaHash = await bcrypt.hash(senha, 12);

    const resultado = await pool.query(
      `INSERT INTO usuarios
        (nome, email, senha_hash, categoria_tarifaria)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, categoria_tarifaria, criado_em`,
      [
        nome.trim(),
        emailNormalizado,
        senhaHash,
        categoria_tarifaria,
      ]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: resultado.rows[0],
    });
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Este e-mail já está cadastrado.",
      });
    }

    logger.error("sistema", "Erro ao cadastrar usuário", { mensagem: erro.message, codigo: erro.code });

    return res.status(500).json({
      erro: "Não foi possível cadastrar o usuário.",
    });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        erro: "Informe o e-mail e a senha.",
      });
    }

    const resultado = await pool.query(
      `SELECT id, nome, email, senha_hash, categoria_tarifaria
       FROM usuarios
       WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (!resultado.rows.length) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const usuario = resultado.rows[0];
    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "E-mail ou senha incorretos.",
      });
    }

    const { senha_hash, ...usuarioSeguro } = usuario;

    return res.json({
      mensagem: "Login realizado com sucesso.",
      token: criarToken(usuario),
      usuario: usuarioSeguro,
    });
  } catch (erro) {
    logger.error("sistema", "Erro durante o login", { mensagem: erro.message });

    return res.status(500).json({
      erro: "Não foi possível realizar o login.",
    });
  }
});

// DADOS DA CONTA AUTENTICADA
app.get("/api/usuario/me", autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nome, email, categoria_tarifaria
       FROM usuarios
       WHERE id = $1`,
      [req.usuarioId]
    );

    if (!resultado.rows.length) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    res.json({ usuario: resultado.rows[0] });
  } catch (erro) {
    logger.error("sistema", "Erro ao buscar usuário", { mensagem: erro.message });

    res.status(500).json({
      erro: "Não foi possível buscar os dados do usuário.",
    });
  }
});

// Calculo da tarifa
async function calcularTarifa(consumoM3, categoria = "residencial") {
  consumoM3 = Number(consumoM3);

  if (!Number.isFinite(consumoM3) || consumoM3 < 0) {
    throw new Error("Consumo em m³ inválido.");
  }

  const categoriasValidas = [
    "vulneravel",
    "social",
    "social2",
    "residencial",
  ];

  if (!categoriasValidas.includes(categoria)) {
    throw new Error("Categoria tarifária inválida.");
  }

  const resultado = await pool.query(
    `SELECT
       faixa_min_m3,
       faixa_max_m3,
       tarifa_fixa_agua,
       valor_m3_agua,
       tarifa_fixa_esgoto,
       valor_m3_esgoto
     FROM public.tarifas
     WHERE categoria_tarifaria = $1
       AND ativo = TRUE
     ORDER BY faixa_min_m3 ASC`,
    [categoria]
  );

  const faixas = resultado.rows;

  if (faixas.length === 0) {
    throw new Error("Nenhuma tarifa ativa encontrada para a categoria.");
  }

  const faixaInicial = faixas[0];

  let agua = Number(faixaInicial.tarifa_fixa_agua);
  let esgoto = Number(faixaInicial.tarifa_fixa_esgoto);

  for (const faixa of faixas) {
    const limiteInferior = Number(faixa.faixa_min_m3);
    const limiteSuperior =
      faixa.faixa_max_m3 === null
        ? Infinity
        : Number(faixa.faixa_max_m3);

    const volumeNaFaixa = Math.max(
      0,
      Math.min(consumoM3, limiteSuperior) - limiteInferior
    );

    agua += volumeNaFaixa * Number(faixa.valor_m3_agua);
    esgoto += volumeNaFaixa * Number(faixa.valor_m3_esgoto);
  }

  agua = Number(agua.toFixed(2));
  esgoto = Number(esgoto.toFixed(2));

  return {
    categoria,
    consumoM3: Number(consumoM3.toFixed(3)),
    agua,
    esgoto,
    total: Number((agua + esgoto).toFixed(2)),
  };
}


 // ROTA TEMPORÁRIA PARA TESTAR TARIFAS
app.get("/api/consumo/testar-tarifa", autenticar, async (req, res) => {
  try {
    const consumoM3 = Number(req.query.consumoM3);
    const categoria = String(req.query.categoria || "");

    if (!Number.isFinite(consumoM3) || consumoM3 < 0) {
      return res.status(400).json({
        erro: "Informe um consumo válido em m³."
      });
    }

    const categoriasValidas = [
      "vulneravel",
      "social",
      "social2",
      "residencial"
    ];

    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        erro: "Categoria inválida.",
        categoriasValidas
      });
    }

    const tarifa = await calcularTarifa(consumoM3, categoria);

    res.json({
      teste: true,
      ...tarifa
    });
  } catch (erro) {
    logger.error("sistema", "Erro ao testar tarifa", { mensagem: erro.message });

    res.status(500).json({
      erro: "Erro ao testar tarifa."
    });
  }
});


// RECEBER CONSUMO DO ESP32
app.post("/api/consumo", async (req, res) => {
  try {
    const { sensor, pulsos, vazao, consumo } = req.body || {};

    logger.info("esp32", "Requisição de medição recebida", {
      ip: req.ip,
      conteudoJsonValido: Boolean(req.body && typeof req.body === "object"),
    });

    if (typeof sensor !== "string" || !sensor.trim()) {
      logger.warn("esp32", "Medição recusada: identificador do sensor ausente ou inválido");
      return res.status(400).json({
        erro: "Informe o identificador do sensor.",
      });
    }

    const identificador = sensor.trim();

    const sensorResult = await pool.query(
      `SELECT usuario_id
       FROM sensores
       WHERE identificador = $1 AND ativo = TRUE`,
      [identificador]
    );

    if (!sensorResult.rows.length) {
      logger.warn("esp32", "Medição recusada: sensor não cadastrado ou inativo", {
        sensor: identificador,
      });
      return res.status(404).json({
        erro: "Sensor não cadastrado ou inativo.",
      });
    }

    const usuarioId = sensorResult.rows[0].usuario_id;
    const consumoAcumulado = Number(consumo);

    if (!Number.isFinite(consumoAcumulado) || consumoAcumulado < 0) {
      logger.warn("esp32", "Medição recusada: consumo acumulado inválido", {
        sensor: identificador,
      });
      return res.status(400).json({
        erro: "Consumo acumulado inválido.",
      });
    }

    const ultimo = await pool.query(
      `SELECT consumo_acumulado
       FROM consumo
       WHERE sensor = $1
       ORDER BY id DESC
       LIMIT 1`,
      [identificador]
    );

    let consumoIntervalo = consumoAcumulado;

    if (ultimo.rows.length) {
      const anterior = Number(ultimo.rows[0].consumo_acumulado);
      consumoIntervalo = consumoAcumulado - anterior;

      if (consumoIntervalo < 0) {
        consumoIntervalo = consumoAcumulado;
      }
    }

    const inserido = await pool.query(
      `INSERT INTO consumo
        (usuario_id, sensor, pulsos, vazao, consumo, consumo_acumulado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        usuarioId,
        identificador,
        Number.isFinite(Number(pulsos)) ? Number(pulsos) : 0,
        Number.isFinite(Number(vazao)) ? Number(vazao) : 0,
        consumoIntervalo,
        consumoAcumulado,
      ]
    );

    logger.info("esp32", "Medição recebida e armazenada", {
      sensor: identificador,
      pulsos: Number.isFinite(Number(pulsos)) ? Number(pulsos) : 0,
      vazao: Number.isFinite(Number(vazao)) ? Number(vazao) : 0,
      consumoIntervalo,
      consumoAcumulado,
    });
    res.status(201).json(inserido.rows[0]);
  } catch (erro) {
    logger.error("esp32", "Falha ao processar medição recebida", { mensagem: erro.message });

    res.status(500).json({
      erro: "Erro ao registrar consumo.",
    });
  }
});

 // LISTAR REGISTROS DO SENSOR COMPARTILHADO
app.get("/api/consumo", autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT *
       FROM consumo
       WHERE sensor = $1
       ORDER BY id DESC`,
      ["Splash"]
    );

    res.json(resultado.rows);
  } catch (erro) {
    logger.error("sistema", "Erro ao buscar registros de consumo", { mensagem: erro.message });

    res.status(500).json({
      erro: "Erro ao buscar registros.",
    });
  }
});

// CONSUMO DE HOJE

 // CONSUMO DE HOJE — COMPARTILHADO
app.get("/api/consumo/hoje", autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT COALESCE(SUM(consumo), 0) AS consumo_hoje
       FROM consumo
       WHERE sensor = $1
         AND data_hora >= CURRENT_DATE
         AND data_hora < CURRENT_DATE + INTERVAL '1 day'`,
      ["Splash"]
    );

    res.json({
      consumoHoje: Number(resultado.rows[0].consumo_hoje),
    });
  } catch (erro) {
    logger.error("sistema", "Erro ao consultar consumo do dia", { mensagem: erro.message });
    res.status(500).json({
      erro: "Erro ao buscar consumo de hoje.",
    });
  }
});

// CONSUMO DO MÊS

 // CONSUMO DO MÊS — COMPARTILHADO
app.get("/api/consumo/mes", autenticar, async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT COALESCE(SUM(consumo), 0) AS consumo_mes
       FROM consumo
       WHERE sensor = $1
         AND data_hora >= DATE_TRUNC('month', CURRENT_DATE)
         AND data_hora < DATE_TRUNC('month', CURRENT_DATE)
                              + INTERVAL '1 month'`,
      ["Splash"]
    );

    res.json({
      consumoMes: Number(resultado.rows[0].consumo_mes),
    });
  } catch (erro) {
    logger.error("sistema", "Erro ao consultar consumo do mês", { mensagem: erro.message });
    res.status(500).json({
      erro: "Erro ao buscar consumo do mês.",
    });
  }
});

// HISTÓRICO — COMPARTILHADO
app.get("/api/consumo/historico", autenticar, async (req, res) => {
  try {
    const { periodo } = req.query;
    let inicio;
    let fim;
    let agrupamento;

    if (periodo === "hoje") {
      inicio = "CURRENT_DATE";
      fim = "CURRENT_DATE + INTERVAL '1 day'";
      agrupamento = "hour";

    } else if (periodo === "7dias") {
      inicio = "CURRENT_DATE - INTERVAL '6 days'";
      fim = "CURRENT_DATE + INTERVAL '1 day'";
      agrupamento = "day";

    } else if (periodo === "mes") {
      inicio = "DATE_TRUNC('month', CURRENT_DATE)";
      fim = "DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'";
      agrupamento = "day";

    } else if (periodo === "ano") {
      inicio = "DATE_TRUNC('year', CURRENT_DATE)";
      fim = "DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'";
      agrupamento = "month";

    } else {
      return res.status(400).json({
        erro: "Período inválido.",
      });
    }

    const resultado = await pool.query(
      `SELECT
         DATE_TRUNC('${agrupamento}', data_hora) AS periodo,
         SUM(consumo) AS consumo
       FROM public.consumo
       WHERE sensor = $1
         AND data_hora >= ${inicio}
         AND data_hora < ${fim}
       GROUP BY DATE_TRUNC('${agrupamento}', data_hora)
       ORDER BY periodo ASC`,
      ["Splash"]
    );

    res.json(resultado.rows);

  } catch (erro) {
    logger.error("sistema", "Erro ao consultar histórico", { mensagem: erro.message });

    res.status(500).json({
      erro: "Erro ao buscar histórico.",
    });
  }
});

 // CUSTO DO MÊS USANDO O SENSOR COMPARTILHADO
app.get("/api/consumo/custo", autenticar, async (req, res) => {
  try {
    const [consumoResult, usuarioResult] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(consumo), 0) AS consumo_mes
         FROM consumo
         WHERE sensor = $1
           AND data_hora >= DATE_TRUNC('month', CURRENT_DATE)
           AND data_hora < DATE_TRUNC('month', CURRENT_DATE)
                                + INTERVAL '1 month'`,
        ["Splash"]
      ),

      pool.query(
        `SELECT categoria_tarifaria
         FROM usuarios
         WHERE id = $1`,
        [req.usuarioId]
      ),
    ]);

    if (!usuarioResult.rows.length) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }


    const consumoLitros = Number(
      consumoResult.rows[0].consumo_mes
    );

    const consumoM3 = consumoLitros / 1000;
    const categoria = usuarioResult.rows[0].categoria_tarifaria;
    const tarifa = await calcularTarifa(consumoM3, categoria);

    res.json({
      categoria,
      consumoLitros: Number(consumoLitros.toFixed(3)),
      consumoM3: Number(consumoM3.toFixed(3)),
      agua: tarifa.agua,
      esgoto: tarifa.esgoto,
      total: tarifa.total,
    });
  } catch (erro) {
    logger.error("sistema", "Erro ao calcular custo", { mensagem: erro.message });

    res.status(500).json({
      erro: "Erro ao calcular custo.",
    });
  }
});

// Captura erros encaminhados pelo Express que não foram tratados nas rotas.
app.use((erro, req, res, next) => {
  logger.error("sistema", "Erro não tratado pelo middleware do Express", {
    mensagem: erro.message,
    metodo: req.method,
    rota: req.path,
    status: erro.status || 500,
  });

  if (res.headersSent) {
    return next(erro);
  }

  res.status(erro.status || 500).json({
    erro: "Ocorreu um erro interno no servidor.",
  });
});

// Monitoramento de erros emitidos pelo pool do PostgreSQL.
pool.on("error", (erro) => {
  logger.error("sistema", "Erro inesperado no pool PostgreSQL", { mensagem: erro.message });
});

// TESTE DE CONEXÃO E INICIALIZAÇÃO
pool.query("SELECT NOW()")
  .then((resultado) => {
    logger.info("sistema", "Conexão com PostgreSQL estabelecida", { horarioBanco: resultado.rows[0].now });
  })
  .catch((erro) => {
    logger.error("sistema", "Falha ao conectar com PostgreSQL", { mensagem: erro.message });
  });

const servidor = app.listen(PORT, "0.0.0.0", () => {
  logger.info("sistema", "Servidor iniciado", { porta: PORT, ambiente: process.env.NODE_ENV || "development" });
});

process.on("SIGINT", () => {
  logger.info("sistema", "Encerramento solicitado (SIGINT)");
  servidor.close(() => pool.end(() => process.exit(0)));
});

process.on("SIGTERM", () => {
  logger.info("sistema", "Encerramento solicitado (SIGTERM)");
  servidor.close(() => pool.end(() => process.exit(0)));
});

process.on("uncaughtException", (erro) => {
  logger.error("sistema", "Exceção não tratada", { mensagem: erro.message, stack: erro.stack });
  process.exit(1);
});

process.on("unhandledRejection", (motivo) => {
  logger.error("sistema", "Promise rejeitada sem tratamento", { mensagem: motivo instanceof Error ? motivo.message : String(motivo) });
});
