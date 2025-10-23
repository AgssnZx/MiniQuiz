import React from "react";
import "./App.css";
import Inicio from "./assets/inicio.png";
import QuizContainer from "./components/quizContainer";

function App() {
  return (
    <div className="App" style={{ textAlign: "center", minHeight: "100vh" }}>
      <header style={{ backgroundColor: "transparent", padding: "20px 0" }}>
        <img
          src={Inicio}
          alt="Logo Mini Quiz"
          style={{
            width: "180px",
            height: "auto",
            borderRadius: "20px",
            backgroundColor: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        />
      </header>

      {/* Componente principal do quiz */}
      <QuizContainer />
    </div>
  );
}

export default App;
