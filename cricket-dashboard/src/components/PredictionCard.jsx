import { useEffect, useState } from "react";
import axios from "axios";

function PredictionCard() {
  const [winner, setWinner] = useState("");
  const [message, setMessage] = useState("Calculating prediction...");

  useEffect(() => {
    let mounted = true;

    axios
      .get("/api/predict/")
      .then((res) => {
        if (!mounted) return;

        setWinner(res.data.predicted_winner || "");
        setMessage(res.data.message || "Predicted winner");
      })
      .catch((error) => {
        if (mounted) {
          setMessage("Prediction unavailable");
        }
        console.error(error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Match forecast
      </p>
      <h2 className="mt-2 text-lg font-bold text-slate-950">{message}</h2>
      <p className="mt-4 text-3xl font-bold text-emerald-800">
        {winner || "No data"}
      </p>
      <p className="mt-2 text-sm text-emerald-700">
        Based on the latest available match score.
      </p>
    </section>
  );
}

export default PredictionCard;
