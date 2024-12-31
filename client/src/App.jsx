import { useState } from "react";
import OpenStreetMap from "./components/maps/Map";
import "./App.css";
import React from "react";
import Navbar from "./components/navBar/NavBar";

function App() {
  return (
    <>
        <Navbar></Navbar>
        <OpenStreetMap />
    </>
  );
}

export default App;
