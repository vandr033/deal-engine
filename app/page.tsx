"use client";

import React, { useState, useEffect, useRef } from "react";
import DestinosForm from "../components/DestinosForm";
import VueloForm from "../components/VueloForm";
import ErrorModal from "../components/ErrorModal";
import { useApi } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHashtag,
  faListNumeric,
  faPlaneArrival,
  faPlaneCircleExclamation,
  faPlaneDeparture,
  faSearch,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCloud,
  faSun,
  faCloudRain,
  faSnowflake,
  faWind,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { ApiResponse, OriginsDestinations } from "@/api/types";

interface FormData {
  destinos: { origen: string; destino: string };
  vuelo: { codigoVuelo: string; aerolinea: string };
}

type FormType = keyof FormData;

const getWeatherIcon = (weatherCode: number) => {
  if (weatherCode <= 1) return faSun;
  if (weatherCode <= 3) return faCloud;
  if (weatherCode <= 67) return faCloudRain;
  if (weatherCode <= 77) return faSnowflake;
  return faWind;
};
export default function Home() {
  const [activeTab, setActiveTab] = useState<FormType>("destinos");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    destinos: { origen: "", destino: "" },
    vuelo: { codigoVuelo: "", aerolinea: "" },
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [originWeather, setOriginWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [expandedFlights, setExpandedFlights] = useState<{
    [key: string]: boolean;
  }>({});
  const [weatherData, setWeatherData] = useState<{ [key: string]: any }>({});

  const fetchWeather = async (lat: any, lon: any) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&current_weather=true`
    );
    return await response.json();
  };

  const toggleFlightDetails = async (flightId: string) => {
    setExpandedFlights((prev) => ({
      ...prev,
      [flightId]: !prev[flightId],
    }));

    if (!expandedFlights[flightId] && !weatherData[flightId]) {
      const flight = searchResults.find(
        (result) => result.flight_num === flightId
      );
      const originWeather = await fetchWeather(
        flight.origin_latitude,
        flight.origin_longitude
      );
      const destinationWeather = await fetchWeather(
        flight.destination_latitude,
        flight.destination_longitude
      );

      setWeatherData((prev) => ({
        ...prev,
        [flightId]: { origin: originWeather, destination: destinationWeather },
      }));
    }
  };

  useEffect(() => {
    if (selectedFlight) {
      fetchWeather(
        selectedFlight.origin_latitude,
        selectedFlight.origin_longitude
      ).then((data) => setOriginWeather(data));
      fetchWeather(
        selectedFlight.destination_latitude,
        selectedFlight.destination_longitude
      ).then((data) => setDestinationWeather(data));
    }
  }, [selectedFlight]);

  const handleViewDetails = (flight: any) => {
    setSelectedFlight(flight);
  };

  useEffect(() => {
    if (searchResults.length === 1) {
      const result = searchResults[0];
      fetchWeather(result.origin_latitude, result.origin_longitude).then(
        setOriginWeather
      );
      fetchWeather(
        result.destination_latitude,
        result.destination_longitude
      ).then(setDestinationWeather);
    }
  }, [searchResults]);

  const { data, error, loading } = useApi<ApiResponse<any>>(
    "http://localhost:3001/vuelos/origins-destinations"
  );

  const origins =
    data?.data.origins.map((item: { origin: any }) => item.origin) || [];
  const destinations =
    data?.data.destinations.map(
      (item: { destination: any }) => item.destination
    ) || [];

  useEffect(() => {
    setSearchResults([]);
  }, [activeTab]);

  const handleFormChange = (
    formType: FormType,
    field: string,
    value: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [formType]: {
        ...prevData[formType],
        [field]: value,
      },
    }));
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let url: string;

    if (activeTab === "destinos") {
      const { origen, destino } = formData.destinos;
      url = `http://localhost:3001/vuelos/origins-destinations/${origen}/${destino}`;
    } else {
      const { codigoVuelo, aerolinea } = formData.vuelo;
      url = `http://localhost:3001/vuelos/flight_num-airline/${codigoVuelo}/${aerolinea}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setTimeout(() => {
          if (data.data.length > 0) {
            const searchResults = document.getElementById("SearchSection");
            searchResults?.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setShowErrorModal(true);
    }
  };

  const handleReset = () => {
    setFormData((prevData) => ({
      ...prevData,
      [activeTab]: Object.fromEntries(
        Object.keys(prevData[activeTab]).map((key) => [key, ""])
      ) as FormData[FormType],
    }));
    setSearchResults([]);
  };

  return (
    <>
      <div className="w-full h-[92vh] bg-white flex flex-col items-center justify-start pt-16 px-8 relative overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-[70%]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4c5fd9"
            d="M0,0 L1440,0 L1440,560 C1380,590 1350,630 1260,610 C1180,590 1100,630 1020,590 C940,550 860,570 780,590 C700,610 620,580 540,610 C460,640 380,620 300,590 C220,560 140,580 60,600 C30,610 0,590 0,570 L0,0 Z"
          />
        </svg>
        <div className="w-full max-w-7xl relative z-10 flex flex-col items-center">
          <div className="w-full">
            <h1 className="text-white text-4xl font-bold mb-2 text-left">
              Travel with confidence,
            </h1>
            <h1 className="text-white text-2xl mb-12 text-left">
              your destination and flight information at your fingertips
            </h1>
          </div>
          <div className="w-full bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-6 px-8 text-2xl font-semibold focus:outline-none transition duration-300 ${
                  activeTab === "destinos"
                    ? "bg-[#003393] text-white"
                    : "bg-white text-[#4cd9c6] hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("destinos")}
              >
                Search by destinations
              </button>
              <button
                className={`flex-1 py-6 px-8 text-2xl font-semibold focus:outline-none transition duration-300 ${
                  activeTab === "vuelo"
                    ? "bg-[#003393] text-white"
                    : "bg-white text-[#4cd9c6] hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("vuelo")}
              >
                Search by flight information
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003393]"></div>
                </div>
              ) : error ? (
                <p>Error, please reload the website</p>
              ) : activeTab === "destinos" ? (
                <DestinosForm
                  origins={origins}
                  destinations={destinations}
                  formData={formData.destinos}
                  onChange={(field, value) =>
                    handleFormChange("destinos", field, value)
                  }
                />
              ) : (
                <VueloForm
                  formData={formData.vuelo}
                  onChange={(field, value) =>
                    handleFormChange("vuelo", field, value)
                  }
                />
              )}
              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-300 text-gray-700 py-4 px-8 rounded-lg text-lg font-medium hover:bg-gray-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <FontAwesomeIcon icon={faUndo} className="mr-2" /> Clear
                  Fields
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#003393] text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-[#002370] transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#003393] focus:ring-opacity-50"
                >
                  <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div
          ref={searchResultsRef}
          id="SearchSection"
          className="w-full h-[92vh] bg-blue-500 p-8"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Search Results:
            </h2>
            <div className="bg-white rounded-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="flex items-center justify-between bg-[#003393] p-4 rounded-lg font-bold mb-4 text-white">
                <span>Origin IATA Code</span>
                <span>Airline</span>
                <span>Flight Information</span>
                <span>Destination IATA Code</span>
                <span>Actions</span>
              </div>
              <ul className="space-y-4">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <span>{result.origin_iata_code}</span>
                      <span>{result.airline}</span>
                      <span>{result.flight_num}</span>
                      <span>{result.destination_iata_code}</span>
                      <button
                        onClick={() => toggleFlightDetails(result.flight_num)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                      >
                        <FontAwesomeIcon
                          icon={
                            expandedFlights[result.flight_num]
                              ? faChevronUp
                              : faChevronDown
                          }
                        />
                      </button>
                    </div>
                    {expandedFlights[result.flight_num] && (
                      <div className="p-4 border-t border-gray-200">
                        <div className="bg-[#3b82f6] p-4 rounded-lg mb-4">
                          <h3 className="text-xl font-semibold mb-2 text-white">
                            Flight Information:
                          </h3>
                          <p className="text-white">
                            <FontAwesomeIcon
                              icon={faPlaneDeparture}
                              className="mr-2"
                            />
                            Origin: {result.origin_name} (
                            {result.origin_iata_code})
                          </p>
                          <p className="text-white">
                            <FontAwesomeIcon
                              icon={faPlaneArrival}
                              className="mr-2"
                            />
                            Destination: {result.destination_name} (
                            {result.destination_iata_code})
                          </p>
                          <p className="text-white">
                            <FontAwesomeIcon
                              icon={faPlaneCircleExclamation}
                              className="mr-2"
                            />
                            Airline: {result.airline}
                          </p>
                          <p className="text-white">
                            <FontAwesomeIcon
                              icon={faHashtag}
                              className="mr-2"
                            />
                            Flight Number: {result.flight_num}
                          </p>
                        </div>
                        {weatherData[result.flight_num] && (
                          <div className="space-y-4">
                            <WeatherCard
                              cityName={"Origin: " + result.origin_name}
                              weatherData={
                                weatherData[result.flight_num].origin
                              }
                              timeStart={12}
                              timeEnd={18}
                            />
                            <WeatherCard
                              cityName={
                                "Destination: " + result.destination_name
                              }
                              weatherData={
                                weatherData[result.flight_num].destination
                              }
                              timeStart={18}
                              timeEnd={24}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {showErrorModal && (
        <ErrorModal
          message="An error occurred. Please try again later."
          onDismiss={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}
const WeatherCard = ({
  cityName,
  weatherData,
  timeStart,
  timeEnd,
}: {
  cityName: string;
  weatherData: any;
  timeStart: number;
  timeEnd: number;
}) => (
  <div className="bg-white rounded-lg shadow-lg p-6 w-full mb-4">
    <h3 className="text-2xl text-[#4cd9d9] font-bold mb-4">{cityName}</h3>
    <div className="flex">
      <div className="w-[30%] border-r pr-4">
        <FontAwesomeIcon
          icon={getWeatherIcon(weatherData.current_weather.weathercode)}
          size="4x"
          className="mb-4 text-[#4cd9d9]"
        />
        <p className="text-3xl font-bold text-[#003393]">
          {weatherData.current_weather.temperature}°C
        </p>
        <p className="text-lg text-[#003393]">{cityName}</p>
        <p className="text-sm">
          Wind: {weatherData.current_weather.windspeed} km/h
        </p>
      </div>
      <div className="w-[70%] pl-4 flex justify-between">
        {weatherData.hourly.time
          .slice(timeStart, timeEnd)
          .map((time: number, index: number) => (
            <div key={time} className="text-center w-[14%]">
              <p className="text-xl">{new Date(time).getHours()}:00</p>
              <FontAwesomeIcon
                icon={getWeatherIcon(
                  weatherData.hourly.weathercode[index + 12]
                )}
                className="my-6 text-[#4cd9d9] text-6xl"
              />
              <p className="text-xl font-bold">
                {weatherData.hourly.temperature_2m[index + 12]}°C
              </p>
            </div>
          ))}
      </div>
    </div>
  </div>
);
