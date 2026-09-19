const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function explainWeather(weather, apiKey, model) {
  const details = JSON.stringify(weather);
  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_completion_tokens: 150,
      messages: [
        {
          role: 'system',
          content: 'You explain supplied current weather data in plain English. Use only the supplied data; do not forecast, claim alerts, or invent facts. Write 2-3 concise sentences including a practical clothing or activity suggestion when supported by the data.'
        },
        { role: 'user', content: `Current weather data: ${details}` }
      ]
    }),
    signal: AbortSignal.timeout(15000)
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || !body.choices?.[0]?.message?.content) {
    const error = new Error('The AI weather explanation is temporarily unavailable.');
    error.statusCode = 502;
    throw error;
  }
  return body.choices[0].message.content.trim();
}

module.exports = { explainWeather };
