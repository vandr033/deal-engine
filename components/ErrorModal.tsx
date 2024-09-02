import React, { useEffect, useState } from "react";

interface ErrorModalProps {
  message: string;
  onDismiss: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prevProgress - 2; // Decrease by 2% every 100ms
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        ×
      </button>
      <p>{message}</p>
      <div className="w-full bg-red-700 rounded-full h-2 mt-2">
        <div
          className="bg-white h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ErrorModal;
