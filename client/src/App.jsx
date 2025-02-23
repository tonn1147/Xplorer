import { useState } from "react";
import OpenStreetMap from "./components/maps/Map";
import "./App.css";
import React from "react";
import Navbar from "./components/navBar/NavBar";

function App() {
  const [waypoints, setWaypoints] = useState([]);

  return (
    <>
        <Navbar setWaypoints={setWaypoints}></Navbar>
        <OpenStreetMap waypoints={waypoints} setWaypoints={setWaypoints} />
    </>
  );
}

export default App;
