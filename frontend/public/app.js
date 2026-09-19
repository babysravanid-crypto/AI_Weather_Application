const form = document.querySelector('#weather-form');
const cityInput = document.querySelector('#city');
const status = document.querySelector('#status');
const result = document.querySelector('#weather-result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) { setStatus('Enter a city name to search.', true); cityInput.focus(); return; }
  setStatus('Finding current weather…');
  result.hidden = true;
  form.querySelector('button').disabled = true;
  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to retrieve weather.');
    showWeather(data);
    setStatus('');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    form.querySelector('button').disabled = false;
  }
});

function showWeather(data) {
  const { location, current } = data;
  document.querySelector('#location').textContent = [location.name, location.region, location.country].filter(Boolean).join(', ');
  document.querySelector('#updated').textContent = `Last updated: ${current.lastUpdated} (local time)`;
  document.querySelector('#temperature').textContent = Math.round(current.temperatureC);
  document.querySelector('#condition').textContent = current.condition;
  const icon = document.querySelector('#condition-icon'); icon.src = current.icon; icon.alt = current.condition;
  const metrics = [['Feels like', `${Math.round(current.feelsLikeC)}°C`], ['Humidity', `${current.humidity}%`], ['Wind', `${current.windKph} km/h ${current.windDirection}`], ['Visibility', `${current.visibilityKm} km`], ['Pressure', `${current.pressureMb} mb`]];
  document.querySelector('#metrics').replaceChildren(...metrics.map(([label, value]) => {
    const item = document.createElement('div');
    const labelElement = document.createElement('span');
    const valueElement = document.createElement('strong');
    labelElement.textContent = label;
    valueElement.textContent = value;
    item.append(labelElement, valueElement);
    return item;
  }));
  document.querySelector('#explanation').textContent = data.explanation || data.explanationError || 'An AI explanation is unavailable right now.';
  result.hidden = false;
}

function setStatus(message, isError = false) { status.textContent = message; status.classList.toggle('error', isError); }
