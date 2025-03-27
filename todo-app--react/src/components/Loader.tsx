import React from "react";
import "../styles/loader.css";

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 50, fullScreen = false }) => {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-container"}>
      <div className="spinner" style={{ width: size, height: size }}></div>
    </div>
  );
};

export default Loader;
