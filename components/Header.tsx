"use client";
import React, { useState, useEffect } from "react";
import logo from "@/assets/logo/logo.jpg";
import Image from "next/image";
import { useLocation, useWeather, useReverseGeocode } from "@/api";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "weather-icons-react";

type Props = {
  isDay: boolean;
};

const Header: React.FC<Props> = ({ isDay }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const weather = useWeather(location);
  const locationInfo = useReverseGeocode(location);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (location && weather && locationInfo) {
      setIsLoaded(true);
    }
  }, [location, weather, locationInfo]);

  const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode === 0) return <WiDaySunny />;
    if (weatherCode >= 1 && weatherCode <= 3) return <WiCloudy />;
    if (weatherCode >= 45 && weatherCode <= 48) return <WiFog />;
    if (
      (weatherCode >= 51 && weatherCode <= 67) ||
      (weatherCode >= 80 && weatherCode <= 82)
    )
      return <WiRain />;
    if (
      (weatherCode >= 71 && weatherCode <= 77) ||
      (weatherCode >= 85 && weatherCode <= 86)
    )
      return <WiSnow />;
    if (weatherCode >= 95) return <WiThunderstorm />;
    return <WiDaySunny />;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="w-full flex items-center justify-between h-20 relative overflow-hidden">
        <div className="flex-shrink-0 ml-4">
          <Image
            src={logo}
            alt="Logo Deal Engine"
            className="h-16 w-auto object-contain"
            width={100}
            height={100}
          />
        </div>
        <div
          className={`w-2/5 h-full ${
            isDay ? "bg-gray-100" : "bg-gray-800 text-white"
          } flex items-center justify-end pr-6 relative right-div rounded-l-full flex-row gap-3 transition-transform duration-500 ease-in-out ${
            isLoaded ? "transform translate-x-0" : "transform translate-x-full"
          }`}
        >
          {isLoaded && (
            <>
              <span className="relative z-10 text-sm md:text-base">
                {isDay ? "Good Morning" : "Good Evening"}
              </span>
              {locationInfo && (
                <span className="relative z-10 text-sm md:text-base">{`${locationInfo.city}, ${locationInfo.countryCode}`}</span>
              )}
              <span className="relative z-10 text-sm md:text-base">
                {currentTime}
              </span>
              {weather && (
                <>
                  <span className="relative z-10 text-sm md:text-base">{`${weather.temperature}°C`}</span>
                  <span className="relative z-10 text-xl md:text-2xl">
                    {getWeatherIcon(weather.weatherCode)}
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
