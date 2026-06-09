export const getWeather = async () => {
  const response = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current=temperature_2m"
  );

  return response.json();
};