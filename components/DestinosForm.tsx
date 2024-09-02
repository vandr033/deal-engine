import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlaneDeparture,
  faPlaneArrival,
} from "@fortawesome/free-solid-svg-icons";

interface DestinosFormProps {
  origins: string[];
  destinations: string[];
  formData: {
    origen: string;
    destino: string;
  };
  onChange: (field: string, value: string) => void;
}

const DestinosForm: React.FC<DestinosFormProps> = ({
  origins,
  destinations,
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        <div className="flex-1">
          <label
            htmlFor="origen"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Origin
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faPlaneDeparture}
                className="text-gray-400"
              />
            </div>
            <select
              id="origen"
              value={formData.origen}
              onChange={(e) => onChange("origen", e.target.value)}
              className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003393] text-base"
            >
              <option value="">Select an airport</option>
              {origins.map((airport, index) => (
                <option key={index} value={airport}>
                  {airport}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label
            htmlFor="destino"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Destination
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon
                icon={faPlaneArrival}
                className="text-gray-400"
              />
            </div>
            <select
              id="destino"
              value={formData.destino}
              onChange={(e) => onChange("destino", e.target.value)}
              className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003393] text-base"
            >
              <option value="">Select an airport</option>
              {destinations.map((airport, index) => (
                <option key={index} value={airport}>
                  {airport}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinosForm;
