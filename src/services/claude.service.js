// Único archivo del proyecto que usa el SDK de Anthropic.
const Anthropic = require('@anthropic-ai/sdk');
const { AppError } = require('../utils/errors');

let client; // se crea una sola vez y se reutiliza

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Claude API: falta ANTHROPIC_API_KEY en el archivo .env');
    throw new AppError(502, 'IA_NO_DISPONIBLE');
  }
  if (!client) client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno
  return client;
}

async function preguntar(texto, system) {
  const msg = await getClient().messages.create({
    model: process.env.CLAUDE_MODEL,
    max_tokens: 1024,
    system: system ??
      'Eres un asistente útil. Responde en español con un máximo de tres frases, en texto plano, sin Markdown ni listas.',
    messages: [{ role: 'user', content: texto }],
  });

  const bloque = msg.content.find((b) => b.type === 'text');
  return {
    respuesta: bloque?.text ?? '',
    uso: {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
    },
  };
}

module.exports = { preguntar };
