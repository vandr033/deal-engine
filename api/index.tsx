import { useState, useEffect } from "react";
import { ApiResponse, ApiMethod, Location } from "./types";

export async function apiCall<T>(
  url: string,
  method: ApiMethod = "GET",
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null, loading: false };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error: error.message, loading: false };
    } else {
      return { data: null, error: "An unknown error occurred", loading: false };
    }
  }
}

export function useApi<T>(url: string, method: ApiMethod = "GET", body?: any) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiCall<T>(url, method, body);
      setState(result);
    };

    fetchData();
  }, [url, method, body]);

  return state;
}

const MEXICO_CITY: Location = { latitude: 19.4326, longitude: -99.1332 };

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      return;
    }

    if ("geolocation" in navigator) {
      console.log("Geolocation is available");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          localStorage.setItem("userLocation", JSON.stringify(newLocation));
        },
        () => {
          setLocation(MEXICO_CITY);
          localStorage.setItem("userLocation", JSON.stringify(MEXICO_CITY));
        }
      );
    } else {
      console.error("Geolocation is not available");
      setLocation(MEXICO_CITY);
      localStorage.setItem("userLocation", JSON.stringify(MEXICO_CITY));
    }
  }, []);

  return location;
}

// New hook for fetching weather data
type WeatherData = {
  temperature: number;
  weatherCode: number;
};

export function useWeather(location: Location | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`;

      const response = await apiCall<{
        current_weather: { temperature: number; weathercode: number };
      }>(url);

      if (response.data) {
        setWeather({
          temperature: response.data.current_weather.temperature,
          weatherCode: response.data.current_weather.weathercode,
        });
      }
    };

    fetchWeather();
    const intervalId = setInterval(fetchWeather, 3600000); // Update every hour

    return () => clearInterval(intervalId);
  }, [location]);

  return weather;
}

type LocationInfo = {
  city: string;
  countryCode: string;
};

export function useReverseGeocode(location: Location | null) {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchLocationInfo = async () => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;

      const response = await apiCall<any>(url);

      if (response.data) {
        setLocationInfo({
          city:
            response.data.address.city ||
            response.data.address.town ||
            response.data.address.village ||
            "Unknown",
          countryCode: response.data.address.country_code.toUpperCase(),
        });
      }
    };

    fetchLocationInfo();
  }, [location]);

  return locationInfo;
}
