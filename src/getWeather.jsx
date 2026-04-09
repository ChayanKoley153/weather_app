import { useState } from "react";
import axiosInstance from "../api/axios";
import { endPoints } from "../api/endPoints";

const API_KEY = "e479261a5ef3e6ab78a63936233ad813";

const getWeather = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchWeather = async (city) => {
        if (!city) return;

        setLoading(true);
        setError("");
        setWeather(null);
        setForecast([]);

        try {
            const weatherRes = await axiosInstance.get(
                `${endPoints.WEATHER}?q=${city}&appid=${API_KEY}&units=metric`
            );

            setWeather(weatherRes.data);

            const forecastRes = await axiosInstance.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );

            const dailyData = forecastRes.data.list.filter((item, index) => index % 8 === 0);
            setForecast(dailyData);
        } catch (err) {
            setError("City not found");
        } finally {
            setLoading(false);
        }
    };

    return { weather, forecast, loading, error, fetchWeather };
};

export default getWeather;