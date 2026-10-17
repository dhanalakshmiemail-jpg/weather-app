
# 🌦️ Atmosphere – Weather Report Application

Atmosphere is a modern and responsive weather application built with React JS, Axios, JavaScript, and CSS. It uses the OpenWeatherMap API to provide real-time weather updates and a five-day forecast with a clean, attractive user interface.

## ✨ Features

- 🔍 Search for weather by city name
- 🌡️ Display current temperature and feels-like temperature
- 💧 View humidity and atmospheric pressure
- 🌬️ Check wind speed and visibility
- ☁️ View cloud coverage and weather conditions
- 📅 Five-day weather forecast
- 🔄 Switch between Celsius and Fahrenheit
- 📱 Responsive design for desktop, tablet, and mobile
- ⚠️ Loading indicators and error handling

## 🛠️ Technologies Used

- React JS
- JavaScript
- Axios
- HTML5
- CSS3
- OpenWeatherMap API
- Create React App

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- A code editor such as Visual Studio Code
- An OpenWeatherMap API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/atmosphere-weather-app.git
   ```

2. Navigate to the project folder:

   ```bash
   cd atmosphere-weather-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add:

   ```env
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## 🔑 API Configuration

Get an API key from [OpenWeatherMap](https://openweathermap.org/api).

Replace `your_api_key_here` with your API key. Newly created keys may take some time to become active.

**Security:** Never upload your actual `.env` file or expose your API key in a public repository.

## 📂 Project Structure

```text
atmosphere-weather-app/
├── public/
├── src/
│   ├── components/
│   │   ├── CurrentWeather.js
│   │   ├── ErrorMessage.js
│   │   ├── Forecast.js
│   │   ├── SearchBar.js
│   │   ├── WeatherApp.js
│   │   └── WeatherDetails.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎯 Project Objective

The objective of Atmosphere is to provide accessible and easy-to-understand weather information through a responsive interface while demonstrating React development, API integration, state management, and modern CSS styling.

## 👩‍💻 Author

Developed as a React JS project to practice frontend development and real-time API integration.

## 📄 License

This project is available for educational and personal learning purposes.

