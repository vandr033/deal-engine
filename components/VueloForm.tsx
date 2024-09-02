import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faPlane } from "@fortawesome/free-solid-svg-icons";

interface VueloFormProps {
  formData: {
    codigoVuelo: string;
    aerolinea: string;
  };
  onChange: (field: string, value: string) => void;
}

const VueloForm: React.FC<VueloFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        <div className="flex-1">
          <label
            htmlFor="codigoVuelo"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Flight number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faHashtag} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="codigoVuelo"
              value={formData.codigoVuelo}
              onChange={(e) => onChange("codigoVuelo", e.target.value)}
              placeholder="Ex: AA1234"
              className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003393] text-base"
            />
          </div>
        </div>
        <div className="flex-1">
          <label
            htmlFor="aerolinea"
            className="block text-sm font-medium text-gray-700 mb-3"
          >
            Airline
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faPlane} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="aerolinea"
              value={formData.aerolinea}
              onChange={(e) => onChange("aerolinea", e.target.value)}
              placeholder="Airline name"
              className="pl-12 w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003393] text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VueloForm;
