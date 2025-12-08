// src/components/Weather/WeatherCard.jsx
import React from 'react';
import { Thermometer, Droplets, Wind, Cloud, Sun, CloudRain } from 'lucide-react';

const WeatherCard = ({ weatherData }) => {
  const getWeatherIcon = (weathercode, isDay) => {
    if ([0, 1].includes(weathercode)) return isDay ? Sun : Cloud;
    if ([2, 3].includes(weathercode)) return Cloud;
    if (weathercode >= 45 && weathercode <= 48) return Cloud;
    if (weathercode >= 51 && weathercode <= 67) return CloudRain;
    if (weathercode >= 71 && weathercode <= 77) return Cloud;
    if (weathercode >= 80 && weathercode <= 99) return CloudRain;
    return Cloud;
  };

  const WeatherIcon = getWeatherIcon(weatherData.current.weathercode, weatherData.current.isDay);

  return (
    <div className="card overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
        <div className="relative p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Current Weather</h2>
              <p className="text-gray-600">
                Lat: {weatherData.location.latitude}, Lon: {weatherData.location.longitude}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-gray-800">
                {weatherData.current.temperature}°C
              </div>
              <div className="flex items-center justify-end space-x-2 mt-2">
                <WeatherIcon className="h-6 w-6 text-blue-500" />
                <span className="text-gray-600">{weatherData.current.description}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {weatherData.today.maxTemp}° / {weatherData.today.minTemp}°
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-50">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rain Chance</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {weatherData.today.precipitationChance || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <Wind className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wind Speed</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {weatherData.current.windspeed} km/h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <Cloud className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Conditions</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {weatherData.current.isDay ? 'Day' : 'Night'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;