import { WeatherData } from '../types';

export const mockWeatherData: WeatherData[] = [
  {
    date: '2026-07-20',
    temperature: { min: 24, max: 32, current: 28 },
    humidity: 75,
    rainfall: 0,
    windSpeed: 15,
    condition: 'cerah',
  },
  {
    date: '2026-07-21',
    temperature: { min: 23, max: 31, current: 27 },
    humidity: 80,
    rainfall: 5,
    windSpeed: 12,
    condition: 'berawan',
  },
  {
    date: '2026-07-22',
    temperature: { min: 23, max: 30, current: 25 },
    humidity: 85,
    rainfall: 15,
    windSpeed: 10,
    condition: 'hujan_ringan',
  },
  {
    date: '2026-07-23',
    temperature: { min: 24, max: 32, current: 28 },
    humidity: 75,
    rainfall: 0,
    windSpeed: 14,
    condition: 'cerah',
  },
  {
    date: '2026-07-24',
    temperature: { min: 25, max: 33, current: 29 },
    humidity: 70,
    rainfall: 0,
    windSpeed: 16,
    condition: 'cerah',
  },
  {
    date: '2026-07-25',
    temperature: { min: 24, max: 31, current: 27 },
    humidity: 80,
    rainfall: 10,
    windSpeed: 11,
    condition: 'hujan_ringan',
    alerts: ['Waspada potensi hujan disertai angin kencang pada sore hari.']
  },
  {
    date: '2026-07-26',
    temperature: { min: 24, max: 32, current: 28 },
    humidity: 75,
    rainfall: 0,
    windSpeed: 13,
    condition: 'berawan',
  }
];
