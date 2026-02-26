"use client";

import { useEffect, useMemo, useState } from "react";

const QUESTIONS = ["First off, how BLUE has your day been so far?"];

function pickStableQuestionIndex(seed: string, length: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return Math.abs(h) % length;
}

const DARK_BLUE = "#1F2E8D";

type LandingSurveyBlockProps = {
  onContinue?: () => void;
};

export default function LandingSurveyBlock({ onContinue }: LandingSurveyBlockProps = {}) {
  const [answer, setAnswer] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [surveyStep, setSurveyStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setMounted(true);
    setSeed(crypto.randomUUID());
  }, []);

  const questionIndex = useMemo(() => {
    if (!seed) return null;
    return pickStableQuestionIndex(seed, QUESTIONS.length);
  }, [seed]);

  const question = useMemo(() => {
    if (questionIndex == null) return "";
    return QUESTIONS[questionIndex];
  }, [questionIndex]);

  useEffect(() => {
    if (!question) return;
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(question.slice(0, i + 1));
      i++;
      if (i >= question.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [question]);

  useEffect(() => {
    if (!mounted) return;
    setAnswer("");
    setEmployeeInfo("");
    setSurveyStep(0);
  }, [question, mounted]);

  const canSubmit = !!seed && answer.trim().length > 0 && answer.trim().length <= 200 && employeeInfo.trim().length > 0;

  if (!mounted) return null;

  const clearActive = answer.trim().length > 0 || employeeInfo.trim().length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: "url('/finalBG.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "max(280px, 30vh)",
        paddingBottom: "100px",
        boxSizing: "border-box",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "min(92%, 1100px)",
          background: "#FFFFFF",
          borderRadius: "50px",
          boxShadow: "0px 15px 50px rgba(0, 0, 0, 0.22)",
          padding: "clamp(20px, 3vw, 40px) clamp(16px, 3.5vw, 50px)",
          position: "relative",
          boxSizing: "border-box",
          marginBottom: "40px",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {surveyStep === 2 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              minHeight: "500px",
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 64px)",
                color: DARK_BLUE,
              }}
            >
              Click below
            </span>

            <div
              style={{
                fontSize: "48px",
                color: DARK_BLUE,
                animation: "bounce 1.5s infinite",
                fontWeight: 900,
                marginTop: "16px",
              }}
            >
              ↓
            </div>

            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes bounce {
                0%,
                20%,
                50%,
                80%,
                100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-20px);
                }
                60% {
                  transform: translateY(-10px);
                }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.4s ease-out" }}>
            <div
              style={{
                marginBottom: "30px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 30px)",
                lineHeight: "1.3",
                textAlign: "center",
                color: "#1F2E8D",
              }}
            >
              {displayText}
              <span
                style={{
                  borderRight: "2px solid #1F2E8D",
                  marginLeft: "2px",
                  animation: "blink 0.7s infinite",
                }}
              />
              <style jsx>{`
                @keyframes blink {
                  0% {
                    opacity: 1;
                  }
                  50% {
                    opacity: 0;
                  }
                  100% {
                    opacity: 1;
                  }
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>

            <div style={{ width: "100%" }}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type here..."
                autoFocus
                style={{
                  width: "100%",
                  height: "clamp(120px, 18vh, 160px)",
                  background: "#F2F2F5",
                  borderRadius: "32px",
                  border: "none",
                  padding: "25px",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  color: "#1F2E8D",
                  resize: "none",
                  outline: "none",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px", marginTop: "22px" }}>
              <style>{`.employee-id-input::placeholder { color: #6b6b80; opacity: 1; }`}</style>
              <input
                className="employee-id-input"
                type="text"
                value={employeeInfo}
                onChange={(e) => setEmployeeInfo(e.target.value)}
                placeholder="Employee ID or Employee Email"
                style={{
                  width: "100%",
                  height: "72px",
                  background: "#F2F2F5",
                  borderRadius: "24px",
                  border: "none",
                  padding: "0 25px",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "20px",
                  color: "#2F3FA3",
                  outline: "none",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {submitError && (
              <div
                role="alert"
                style={{
                  marginTop: "16px",
                  width: "100%",
                  color: "#DC3545",
                  fontSize: "14px",
                  fontFamily: "'Poppins', sans-serif",
                  textAlign: "center",
                }}
              >
                {submitError}
              </div>
            )}

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "clamp(10px, 2vw, 20px)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setAnswer("");
                  setEmployeeInfo("");
                }}
                style={{
                  width: "min(100%, 190px)",
                  height: "56px",
                  background: clearActive ? "#1F2E8D" : "#938E8E",
                  borderRadius: "100px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: clearActive ? "0 12px 30px rgba(31, 46, 141, 0.30)" : "none",
                  filter: clearActive ? "saturate(1.12) brightness(1.02)" : "none",
                  transition: "transform 0.12s ease, box-shadow 0.18s ease, filter 0.18s ease, background 0.18s ease",
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px) scale(0.99)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px) scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px) scale(1)")}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!canSubmit || submitting) return;
                  setSubmitting(true);
                  setSubmitError(null);
                  try {
                    const res = await fetch("/api/answers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        seed,
                        questionIndex,
                        questionText: question,
                        answerText: answer.trim(),
                        employeeInfo: employeeInfo.trim(),
                      }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                      setSurveyStep(2);
                    } else {
                      setSubmitError(data?.error ?? "Failed to save. Please try again.");
                    }
                  } catch (e) {
                    console.error(e);
                    setSubmitError("Network error. Please try again.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={!canSubmit || submitting}
                style={{
                  width: "min(100%, 190px)",
                  height: "56px",
                  background: canSubmit
                    ? "linear-gradient(135deg, rgba(31,46,141,0.95) 0%, rgba(88,64,193,0.92) 55%, rgba(40,43,213,0.9) 100%)"
                    : "#BDBDBD",
                  borderRadius: "100px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 12px 30px rgba(31, 46, 141, 0.35)" : "none",
                  filter: canSubmit ? "saturate(1.08) brightness(1.02)" : "none",
                  transition: "opacity 0.2s, transform 0.12s ease, box-shadow 0.18s ease, filter 0.18s ease",
                }}
                onMouseDown={(e) => canSubmit && !submitting && (e.currentTarget.style.transform = "translateY(1px) scale(0.99)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
              >
                {submitting ? "..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}