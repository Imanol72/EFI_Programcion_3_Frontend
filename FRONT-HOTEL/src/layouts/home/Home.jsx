// src/layouts/home/Home.jsx
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import "./Home.css";

export default function Home() {
  return (
    <div
      className="home-hero"
      style={{ backgroundImage: `url(/imgs/hotel-fachada.jpg)` }}
    >
      <div className="home-circle">
        <h1 className="home-title">HotelApp</h1>
        <div className="home-actions">
          <Link to="/inicio-sesion">
            <Button label="Login" rounded />
          </Link>
          <Link to="/registro">
            <Button label="Register" rounded />
          </Link>
        </div>
      </div>
    </div>
  );
}
