import React, { useMemo, useState, useEffect } from "react";
import "../styles/quiz.css";
import Final from "../assets/final.mp4";

export default function QuizContainer() {
  const [stage, setStage] = useState("intro"); // intro | quiz | end
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API Trivia DB
  const API_URL =
    "https://opentdb.com/api.php?amount=5&category=19&difficulty=easy&type=multiple"; // Matemática

  // Função para decodificar texto HTML (&quot;, etc.)
  const decodeHTML = (str) =>
    str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  // Buscar perguntas da API
  useEffect(() => {
    if (stage === "quiz" && questions.length === 0) {
      setLoading(true);
      fetch(API_URL)
        .then((res) => {
          if (!res.ok) throw new Error("Erro HTTP " + res.status);
          return res.json();
        })
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const formatted = data.results.map((q) => {
              const options = [...q.incorrect_answers];
              const correctIndex = Math.floor(Math.random() * (options.length + 1));
              options.splice(correctIndex, 0, q.correct_answer);
              return {
                text: decodeHTML(q.question),
                options: options.map(decodeHTML),
                correct: correctIndex,
              };
            });
            setQuestions(formatted);
          } else {
            throw new Error("Nenhuma pergunta recebida.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("❌ Falha ao carregar perguntas. Tente novamente.");
        })
        .finally(() => setLoading(false));
    }
  }, [stage]);

  //  Barra de progresso
  const progress = useMemo(
    () => (questions.length > 0 ? ((current + (stage === "end" ? 1 : 0)) / questions.length) * 100 : 0),
    [current, stage, questions]
  );

  //  Iniciar o quiz
  const startQuiz = () => {
    setStage("quiz");
    setCurrent(0);
    setFeedback("");
    setQuestions([]); // limpa antes de buscar novas perguntas
    setError("");
  };

  // Verificar resposta
  const handleAnswer = (index) => {
    const correctIndex = questions[current].correct;

    if (index === correctIndex) {
      setFeedback("✅ Correto!");
      setTimeout(() => {
        setFeedback("");
        if (current < questions.length - 1) {
          setCurrent((c) => c + 1);
        } else {
          setStage("end");
        }
      }, 600);
    } else {
      setFeedback("❌ Errou!");
      setTimeout(() => {
        alert("Errou! Voltando ao início...");
        setCurrent(0);
        setStage("intro");
        setFeedback("");
      }, 800);
    }
  };

  // Tela inicial
  if (stage === "intro") {
    return (
      <div className="container">
        <h1>Mini Quiz</h1>
        <p>Responda com atenção… as pegadinhas te esperam!</p>
        <button className="start-btn" onClick={startQuiz}>
          Começar
        </button>
        <div className="progress" aria-hidden="true">
          <span style={{ width: 0 }} />
        </div>
      </div>
    );
  }

  // Tela de carregamento
  if (loading) {
    return (
      <div className="container">
        <h2>Carregando perguntas...</h2>
      </div>
    );
  }

  // Erro na API
  if (error) {
    return (
      <div className="container">
        <h2>{error}</h2>
        <button className="restart-btn" onClick={() => setStage("intro")}>
          Voltar
        </button>
      </div>
    );
  }

 // Tela final
if (stage === "end") {
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h2>🎉 Parabéns, você venceu o Mini Quiz!</h2>
      <p>Você respondeu todas as {questions.length} perguntas!</p>

      {/* GIF centralizado */}
      <video
  src={Final}
  autoPlay
  loop
  muted
  style={{
    width: "250px",
    height: "250px",
    objectFit: "contain",
    margin: "20px auto",
    display: "block",
    borderRadius: "12px"
  }}
/>

      <button className="restart-btn" onClick={() => window.location.reload()}>
        Jogar novamente
      </button>

      <div className="progress" aria-hidden="true">
        <span style={{ width: "100%" }} />
      </div>
    </div>
  );
}

  // Se ainda não há perguntas
  if (questions.length === 0) {
    return null;
  }

  // Pergunta atual
  const question = questions[current];

  return (
    <div className="container" key={current}>
      <h2>{question.text}</h2>

      {feedback && (
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "12px",
            transition: "opacity 0.3s ease",
          }}
        >
          {feedback}
        </p>
      )}

      <div className="options">
        {question.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(idx)} className="option-btn">
            {opt}
          </button>
        ))}
      </div>

      <p>
        Pergunta <strong>{current + 1}</strong> de {questions.length}
      </p>

      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={questions.length}
        aria-valuenow={current}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}