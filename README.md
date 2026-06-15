# Desafio API Tests

Projeto pessoal e opcional para praticar testes automatizados de API e integração contínua. Implementa testes contra uma API pública REST utilizando **Mocha** e `fetch` nativo do Node.js, com pipeline de CI via **GitHub Actions** gerando e publicando relatório de execução.

---

## Objetivo

Explorar na prática a criação de testes de API sem mocks ou stubs — validando respostas HTTP reais de uma API pública — e integrá-los a uma pipeline de CI completa com geração de relatório visual.

---

## API Escolhida — JSONPlaceholder

**URL base:** `https://jsonplaceholder.typicode.com`

[JSONPlaceholder](https://jsonplaceholder.typicode.com) é uma API REST gratuita e pública voltada para prototipação e testes. Foi escolhida por:

- Não exigir autenticação
- Retornos previsíveis e estáveis
- Suporte aos principais verbos HTTP (GET, POST, PUT, DELETE)
- Disponibilidade permanente e sem limites de rate
- Dados de exemplo bem estruturados (posts, usuários, comentários)

---

## Estrutura de Arquivos

```
desafio-api-tests/
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline de CI do GitHub Actions
├── test/
│   └── api.test.js         # Testes de API com Mocha
├── .gitignore
├── package.json
└── README.md
```

---

## Instalação

Certifique-se de ter **Node.js 20+** instalado (o `fetch` é nativo a partir dessa versão — nenhuma biblioteca adicional é necessária). Em seguida, instale as dependências:

```bash
npm install
```

---

## Execução dos Testes

```bash
npm test
```

O comando executa o Mocha com o reporter **mochawesome**, que gera um relatório HTML em:

```
mochawesome-report/index.html
```

Abra esse arquivo no navegador para visualizar os resultados de forma detalhada.

---

## Cenários de Teste

Os testes estão em `test/api.test.js` e cobrem os seguintes cenários:

| # | Método | Endpoint | O que valida |
|---|--------|----------|--------------|
| 1 | GET | `/posts/1` | Status 200 e presença dos campos `id`, `title`, `body`, `userId` |
| 2 | GET | `/posts` | Status 200 e array com exatamente 100 itens |
| 3 | GET | `/users/1` | Status 200, campo `name` não vazio e `email` com `@` |
| 4 | POST | `/posts` | Status 201 e retorno do recurso criado com campo `id` |
| 5 | GET | `/posts/999` | Status 404 para recurso inexistente |

---

## Pipeline de CI — GitHub Actions

O arquivo `.github/workflows/ci.yml` centraliza toda a pipeline em um único arquivo, contemplando os três tipos de trigger e as cinco etapas do job.

### Triggers — quando a pipeline é executada

| # | Trigger | Descrição |
|---|---------|-----------|
| 1 | `push` | Executa automaticamente em qualquer push para qualquer branch |
| 2 | `workflow_dispatch` | Permite execução manual pela aba **Actions** do repositório no GitHub |
| 3 | `schedule` | Execução agendada a cada **15 minutos** no fuso `America/Sao_Paulo` — cron `*/15 * * * *` |

### Etapas do Job

| # | Step | O que faz |
|---|------|-----------|
| 1 | **Checkout** | Baixa o código do repositório no runner |
| 2 | **Setup Node.js 20** | Configura o ambiente com cache do npm para acelerar instalações |
| 3 | **npm ci** | Instala as dependências de forma determinística via `package-lock.json` |
| 4 | **npm test** | Executa os testes de API e gera o relatório HTML via mochawesome |
| 5 | **Upload Artifact** | Publica o relatório como artefato da pipeline com retenção de 30 dias |

O step de upload usa `if: always()`, garantindo que o relatório seja publicado **mesmo quando os testes falham**.

### Como visualizar o relatório

1. Acesse o repositório no GitHub
2. Clique na aba **Actions**
3. Selecione a execução desejada
4. Na seção **Artifacts**, faça o download do arquivo `mochawesome-report`
5. Extraia o `.zip` e abra o arquivo `index.html` no navegador

### Como disparar manualmente

Pela interface do GitHub:
1. Aba **Actions** → workflow **CI** → botão **Run workflow**

Pelo terminal com GitHub CLI:
```bash
gh workflow run ci.yml --repo hugo-moreira/desafio-api-tests --ref main
```

---

## Conceitos Utilizados

### CI/CD (Integração Contínua / Entrega Contínua)

**Integração Contínua** é a prática de integrar e validar o código automaticamente a cada alteração. A pipeline garante que os testes de API sejam executados a cada push, prevenindo regressões antes que cheguem à produção.

### GitHub Actions

Plataforma de automação integrada ao GitHub. Os workflows são definidos em YAML dentro de `.github/workflows/`. Os três triggers configurados neste projeto garantem cobertura completa: automático (push), manual (workflow_dispatch) e recorrente (schedule).

### Fetch API (nativo Node.js 20+)

A partir do Node.js 18, o `fetch` está disponível globalmente sem necessidade de bibliotecas externas (como `axios` ou `node-fetch`). Isso simplifica o setup e reduz as dependências do projeto.

### Mocha

Framework de testes para JavaScript/Node.js. Organiza os testes com `describe` (suite) e `it` (caso individual). O `this.timeout(10000)` ajusta o timeout para 10 segundos, acomodando a latência de rede das chamadas reais à API.

### mochawesome

Reporter para Mocha que gera relatório visual em HTML com status de cada teste, duração e mensagens de erro. Integrado à pipeline via `--reporter mochawesome`, o relatório é publicado automaticamente como artefato após cada execução.

### `npm ci`

Substituto determinístico do `npm install` para ambientes de CI. Instala as dependências **exatamente** como definido no `package-lock.json`, garantindo consistência entre execuções locais e na pipeline.

### `if: always()`

Condicional do GitHub Actions que força um step a executar independente do resultado dos steps anteriores. Usado no upload do artefato para garantir que o relatório seja salvo mesmo quando os testes falham.
