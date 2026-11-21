const fs = require('fs');
const path = require('path');

const pastaLogs = path.join(__dirname, 'logs');

function dataArquivo(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function dataHora(data = new Date()) {
  return data.toLocaleString('pt-BR', { hour12: false });
}

function formatarDetalhes(detalhes) {
  if (detalhes === undefined || detalhes === null) return '';
  if (typeof detalhes === 'string') return detalhes;

  try {
    return JSON.stringify(detalhes);
  } catch (erro) {
    return '[detalhes não puderam ser convertidos para JSON]';
  }
}

function registrar(nivel, categoria, mensagem, detalhes, mostrarConsole = true) {
  const complemento = formatarDetalhes(detalhes);
  const linha = `[${dataHora()}] [${nivel}] [${categoria}] ${mensagem}` +
    (complemento ? ` | ${complemento}` : '') + '\n';

  try {
    fs.mkdirSync(pastaLogs, { recursive: true });
    const arquivo = path.join(pastaLogs, `${categoria}-${dataArquivo()}.txt`);
    fs.appendFileSync(arquivo, linha, { encoding: 'utf8' });
  } catch (erroArquivo) {
    // Mantém o erro visível no terminal caso não seja possível gravar o log.
    console.error('[LOGGER] Não foi possível gravar o log:', erroArquivo.message);
  }

  if (mostrarConsole) {
    const saida = nivel === 'ERROR' ? console.error : nivel === 'WARN' ? console.warn : console.info;
    saida.call(console, linha.trim());
  }
}

function registrarErro(categoria, mensagem, detalhes) {
  // Mantém o erro também no arquivo da categoria de origem (ex.: sistema ou esp32).
  registrar('ERROR', categoria, mensagem, detalhes);

  // Centraliza todos os erros em erros-AAAA-MM-DD.txt para facilitar auditoria.
  registrar('ERROR', 'erros', mensagem, {
    categoriaOrigem: categoria,
    ...(detalhes && typeof detalhes === 'object' ? detalhes : { detalhes }),
  }, false);
}

module.exports = {
  info: (categoria, mensagem, detalhes) => registrar('INFO', categoria, mensagem, detalhes),
  warn: (categoria, mensagem, detalhes) => registrar('WARN', categoria, mensagem, detalhes),
  error: registrarErro,
  request: (dados) => {
    const nivel = dados.status >= 500 ? 'ERROR' : dados.status >= 400 ? 'WARN' : 'INFO';
    const mensagem = `${dados.metodo} ${dados.rota}`;
    const detalhes = { status: dados.status, duracaoMs: dados.duracaoMs };

    if (nivel === 'ERROR') {
      registrarErro('requisicoes', mensagem, detalhes);
    } else {
      registrar(nivel, 'requisicoes', mensagem, detalhes);
    }
  },
};
