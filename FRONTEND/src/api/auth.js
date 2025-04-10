export async function login(email, senha) {
    const resposta = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
  
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.mensagem || 'Erro no login');
    return dados;
  }
  