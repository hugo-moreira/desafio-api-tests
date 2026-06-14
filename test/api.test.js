import assert from 'assert';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('Testes de API - JSONPlaceholder', function () {
  this.timeout(10000);

  it('1) GET /posts/1 retorna status 200 e campos esperados', async function () {
    const response = await fetch(`${BASE_URL}/posts/1`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'id'), 'Campo "id" deve estar presente');
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'title'), 'Campo "title" deve estar presente');
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'body'), 'Campo "body" deve estar presente');
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'userId'), 'Campo "userId" deve estar presente');
  });

  it('2) GET /posts retorna lista com 100 itens', async function () {
    const response = await fetch(`${BASE_URL}/posts`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(data), 'Resposta deve ser um array');
    assert.strictEqual(data.length, 100);
  });

  it('3) GET /users/1 retorna usuário com name e email', async function () {
    const response = await fetch(`${BASE_URL}/users/1`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'name'), 'Campo "name" deve estar presente');
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'email'), 'Campo "email" deve estar presente');
    assert.ok(typeof data.name === 'string' && data.name.length > 0, 'Campo "name" deve ser uma string não vazia');
    assert.ok(typeof data.email === 'string' && data.email.includes('@'), 'Campo "email" deve ser um endereço válido');
  });

  it('4) POST /posts cria recurso e retorna status 201', async function () {
    const payload = {
      title: 'Teste de criação',
      body: 'Conteúdo do post criado via teste automatizado',
      userId: 1,
    };

    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    assert.strictEqual(response.status, 201);
    assert.ok(Object.prototype.hasOwnProperty.call(data, 'id'), 'Recurso criado deve conter campo "id"');
    assert.strictEqual(data.title, payload.title);
    assert.strictEqual(data.body, payload.body);
    assert.strictEqual(data.userId, payload.userId);
  });

  it('5) GET /posts/999 retorna status 404', async function () {
    const response = await fetch(`${BASE_URL}/posts/999`);

    assert.strictEqual(response.status, 404);
  });
});
