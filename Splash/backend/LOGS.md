# Sistema de logs do Splash

O backend grava automaticamente arquivos `.txt` na pasta `backend/logs/` durante a execução.

## Arquivos gerados

- `sistema-AAAA-MM-DD.txt`: inicialização, encerramento, conexão com PostgreSQL e falhas gerais.
- `requisicoes-AAAA-MM-DD.txt`: método HTTP, rota, código de resposta e duração.
- `esp32-AAAA-MM-DD.txt`: requisições de medição recebidas, medições armazenadas e dados recusados (por exemplo, sensor inválido ou inativo).
- `erros-AAAA-MM-DD.txt`: cópia centralizada de erros do backend, do Express, do PostgreSQL, do processamento do ESP32 e de respostas HTTP 5xx.

A data no nome do arquivo muda diariamente. Os registros são acrescentados ao arquivo do dia, sem apagar os registros anteriores. A pasta `logs` é criada automaticamente quando o primeiro evento é registrado.

## Como testar

1. Abra um terminal na pasta `Artem/Splash/backend`.
2. Execute `npm start`.
3. Acesse a aplicação ou faça requisições à API.
4. Verifique a pasta `Artem/Splash/backend/logs`.

Cada linha contém data/hora, nível (`INFO`, `WARN` ou `ERROR`), categoria e mensagem. O middleware registra todas as respostas HTTP. Respostas 4xx são avisos e respostas 5xx são erros. Todos os registros de nível ERROR também são copiados para `erros-AAAA-MM-DD.txt`, mantendo o registro original na categoria de origem.

Por segurança, o middleware não grava cabeçalhos de autorização nem o corpo das requisições. Evite adicionar senhas, tokens ou dados pessoais às mensagens de log.

## Observações sobre o ESP32

O arquivo `esp32-AAAA-MM-DD.txt` é gerado pelo backend quando ele recebe requisições do ESP32 em `/api/consumo`. Ele registra a chegada da medição, o armazenamento bem-sucedido e recusas/erros no processamento. Eventos locais do microcontrolador, como perda de Wi-Fi antes de conseguir alcançar a API, continuam aparecendo no Monitor Serial do próprio ESP32; o backend não consegue gravar um evento que nunca recebeu pela rede.
