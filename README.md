# Desafio API Tests

Projeto desenvolvido na disciplina de **Programação para Automações de Testes** da pós-graduação. Implementa testes automatizados contra uma API pública REST e uma pipeline de integração contínua via **GitHub Actions** com geração e publicação de relatório.

---

## Objetivo

Demonstrar a criação de testes de API utilizando **Mocha** e `fetch` nativo do Node.js, validando respostas HTTP reais de uma API pública — sem mocks ou stubs — e integrar esses testes a uma pipeline de CI completa.

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

O arquivo `.github/workflows/ci.yml` configura a pipeline de integração contínua.

### Quando a pipeline é executada

| Trigger | Descrição |
|---|---|
| `push` | Executa automaticamente em qualquer push para qualquer branch |
| `workflow_dispatch` | Permite execução manual pela aba **Actions** do repositório no GitHub |
| `schedule` | Execução agendada todo **domingo às 15h00 (UTC-3)** — cron `0 18 * * 0` |

### Etapas do Job

```
1. Checkout          → baixa o código do repositório
2. Setup Node.js 20  → configura o ambiente com cache do npm
3. npm ci            → instala as dependências de forma determinística
4. npm test          → executa os testes de API e gera o relatório mochawesome
5. Upload Artifact   → publica o relatório como artefato da pipeline
```

O step de upload usa `if: always()`, garantindo que o relatório seja publicado **mesmo quando os testes falham**.

### Como visualizar o relatório

1. Acesse o repositório no GitHub
2. Clique na aba **Actions**
3. Selecione a execução desejada
4. Na seção **Artifacts**, faça o download do arquivo `mochawesome-report`
5. Extraia o `.zip` e abra o arquivo `index.html` no navegador

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
