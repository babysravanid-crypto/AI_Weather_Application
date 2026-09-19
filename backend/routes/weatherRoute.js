const { getCurrentWeather } = require('../services/weatherService');
const { explainWeather } = require('../services/groqService');
const config = require('../config/env');

async function handleWeatherRequest(requestUrl, response) {
  const city = requestUrl.searchParams.get('city')?.trim();
  if (!city) return sendJson(response, 400, { error: 'Enter a city name to search.' });
  if (city.length > 100) return sendJson(response, 400, { error: 'City name must be 100 characters or fewer.' });
  if (!config.weatherApiKey || !config.groqApiKey) {
    return sendJson(response, 500, { error: 'Server API keys are not configured. Add them to .env.' });
  }

  try {
    const weather = await getCurrentWeather(city, config.weatherApiKey);
    let explanation = null;
    let explanationError = null;
    try {
      explanation = await explainWeather(weather, config.groqApiKey, config.groqModel);
    } catch (error) {
      explanationError = error.message;
    }
    return sendJson(response, 200, { ...weather, explanation, explanationError });
  } catch (error) {
    return sendJson(response, error.statusCode || 500, { error: error.message || 'Unable to retrieve weather.' });
  }
}

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

module.exports = { handleWeatherRequest };
