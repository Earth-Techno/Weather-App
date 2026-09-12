// ============================================
// Weather App — WeatherAPI.com
// ============================================

const API_KEY = "461a4b45016246bb926104607261209";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

const $ = (id) => document.getElementById(id);

const els = {
  form: $("searchForm"),
  input: $("cityInput"),
  loader: $("loader"),
  error: $("error"),
  result: $("result"),

  locationName: $("locationName"),
  localTime: $("localTime"),

  weatherIcon: $("weatherIcon"),
  conditionText: $("conditionText"),
  tempC: $("tempC"),
  tempF: $("tempF"),

  feelsLike: $("feelsLike"),
  humidity: $("humidity"),
  wind: $("wind"),
  windDir: $("windDir"),
  gust: $("gust"),
  pressure: $("pressure"),
  precip: $("precip"),
  cloud: $("cloud"),
  visibility: $("visibility"),
  uv: $("uv"),
  isDay: $("isDay"),
  dewPoint: $("dewPoint"),
  heatIndex: $("heatIndex"),
  windChill: $("windChill"),
  lat: $("lat"),
  lon: $("lon"),

  co: $("co"),
  no2: $("no2"),
  o3: $("o3"),
  so2: $("so2"),
  pm25: $("pm25"),
  pm10: $("pm10"),
  usEpa: $("usEpa"),
  gbDefra: $("gbDefra")
};

// ---------- Fetch ----------
async function getWeather(location) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`;
  const res = await fetch(url);

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

// ---------- Render ----------
function render(data) {
  const { location: loc, current: cur } = data;

  // Location
  els.locationName.textContent =
    `${loc.name}, ${loc.region ? loc.region + ", " : ""}${loc.country}`;
  els.localTime.textContent = `Local time: ${loc.localtime} • ${loc.tz_id}`;

  // Condition
  els.weatherIcon.src = "https:" + cur.condition.icon;
  els.weatherIcon.alt = cur.condition.text;
  els.conditionText.textContent = cur.condition.text;

  // Temperatures
  els.tempC.textContent = Math.round(cur.temp_c);
  els.tempF.textContent = `${Math.round(cur.temp_f)}°F`;

  // Details
  els.feelsLike.textContent = `${cur.feelslike_c}°C / ${cur.feelslike_f}°F`;
  els.humidity.textContent = `${cur.humidity}%`;
  els.wind.textContent = `${cur.wind_kph} km/h (${cur.wind_mph} mph)`;
  els.windDir.textContent = `${cur.wind_dir} (${cur.wind_degree}°)`;
  els.gust.textContent = `${cur.gust_kph} km/h`;
  els.pressure.textContent = `${cur.pressure_mb} mb / ${cur.pressure_in} in`;
  els.precip.textContent = `${cur.precip_mm} mm / ${cur.precip_in} in`;
  els.cloud.textContent = `${cur.cloud}%`;
  els.visibility.textContent = `${cur.vis_km} km / ${cur.vis_miles} mi`;
  els.uv.textContent = cur.uv;
  els.isDay.textContent = cur.is_day === 1 ? "Yes" : "No";
  els.dewPoint.textContent = `${cur.dewpoint_c}°C / ${cur.dewpoint_f}°F`;
  els.heatIndex.textContent = `${cur.heatindex_c}°C / ${cur.heatindex_f}°F`;
  els.windChill.textContent = `${cur.windchill_c}°C / ${cur.windchill_f}°F`;
  els.lat.textContent = loc.lat;
  els.lon.textContent = loc.lon;

  // Air Quality (may be absent)
  const aqi = cur.air_quality || {};
  els.co.textContent      = aqi.co      != null ? aqi.co.toFixed(1)      + " µg/m³" : "—";
  els.no2.textContent     = aqi.no2     != null ? aqi.no2.toFixed(1)     + " µg/m³" : "—";
  els.o3.textContent      = aqi.o3      != null ? aqi.o3.toFixed(1)      + " µg/m³" : "—";
  els.so2.textContent     = aqi.so2     != null ? aqi.so2.toFixed(1)     + " µg/m³" : "—";
  els.pm25.textContent    = aqi.pm2_5   != null ? aqi.pm2_5.toFixed(1)   + " µg/m³" : "—";
  els.pm10.textContent    = aqi.pm10    != null ? aqi.pm10.toFixed(1)    + " µg/m³" : "—";
  els.usEpa.textContent   = aqi["us-epa-index"]    ?? "—";
  els.gbDefra.textContent = aqi["gb-defra-index"]  ?? "—";

  els.result.classList.remove("hidden");
}

// ---------- UI helpers ----------
const showLoader = (on) => els.loader.classList.toggle("hidden", !on);
const showError  = (msg) => {
  els.error.textContent = msg;
  els.error.classList.remove("hidden");
};
const hideError = () => els.error.classList.add("hidden");

// ---------- Handler ----------
async function handleSearch(e) {
  e.preventDefault();
  const location = els.input.value.trim();
  if (!location) return;

  hideError();
  showLoader(true);
  els.result.classList.add("hidden");

  try {
    const data = await getWeather(location);
    render(data);
  } catch (err) {
    console.error(err);
    showError(err.message || "Something went wrong. Try again.");
  } finally {
    showLoader(false);
  }
}

// ---------- Init ----------
els.form.addEventListener("submit", handleSearch);

// Optional: default city on load
window.addEventListener("DOMContentLoaded", () => {
  els.input.value = "Kathmandu";
  els.form.dispatchEvent(new Event("submit"));
});
