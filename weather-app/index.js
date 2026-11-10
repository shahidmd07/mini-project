require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const path = require("path");
const axios = require("axios");

// API key fetch from .env file 
const API_KEY = process.env.WEATHER_API_KEY;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "assests")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded( { extended: true } ));

app.get("/", (req, res) => {
    res.redirect("/search");
});

app.get("/search", (req, res) => {
    res.render("index.ejs");
});

app.post("/weather/query", (req, res) => {
    const query = req.body.query.trim();

    res.redirect(`/weather/${encodeURIComponent(query)}`);
});

app.get("/weather/:query", async (req, res) => {
    const q = req.params.query;

    try {
        const query = encodeURIComponent(q);

        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${API_KEY}&units=metric`;

        const [currentResponse, forecastResponse] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        const data = currentResponse.data;
        const forecastData = forecastResponse.data;

        const next24Hours = forecastData.list.slice(0, 8);

        const weatherDetails = {
            queryName: data.name,

            tempC: Number(data.main.temp.toFixed(1)),
            tempF: Number(((data.main.temp * 9/5) + 32).toFixed(1)),

            feelsLikeC: Number(data.main.feels_like.toFixed(1)),
            feelsLikeF: Number(((data.main.feels_like * 9/5) + 32).toFixed(1)),

            condition: data.weather[0].main,
            description: data.weather[0].description,

            humidity: data.main.humidity,
            windSpeed: Number((data.wind.speed * 3.6).toFixed(2)),

            precipitation: Math.round(Math.max(...next24Hours.map(item => item.pop ?? 0)) * 100),
            coordinates: `${Math.abs(data.coord.lat).toFixed(3)}° ${data.coord.lat >= 0 ? "N" : "S"}, ${Math.abs(data.coord.lon).toFixed(3)}° ${data.coord.lon >= 0 ? "E" : "W"}`
        };

        res.render("detail.ejs", { weather: weatherDetails });

    } catch (err) {
        res.status(500).send("query not found or API error!");
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

