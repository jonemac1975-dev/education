// =====================================================
// EXAM – TEST ENGLISH (STUDENT) – FINAL STABLE
// File: /js/exam.js
// =====================================================

import { FirebaseService } from "../src/services/firebaseService.js";

/* ================= CONFIG ================= */
const TEACHER_ID = "GV_1769051526449";
const EXAM_MINUTES = 50;
const POINT_PER_QUESTION = 0.2;

/* ================= STATE ================= */
let studentId = null;
let examId = null;
let examData = null;
let answers = {};
let timer = null;
let remainSeconds = EXAM_MINUTES * 60;
let isReviewMode = false;

/* ================= ENTRY ================= */
export function initExam() {
  studentId = sessionStorage.getItem("studentId");
  if (!studentId) {
    alert("Not logged in");
    return;
  }

  renderLayout();
  loadExamList();
}

/* ================= LAYOUT ================= */
function renderLayout() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="exam-wrap">

      <div class="exam-header">
        <div class="exam-title">📘 MULTIPLE CHOICE TEST</div>
        <div class="exam-info">
          <div>👤 Exam Candidates: <b>${studentId}</b></div>
          <div>⏱ <span id="timer" class="exam-timer">--:--</span></div>
        </div>
      </div>

      <div class="exam-main">

        <div class="exam-left" id="questionBox">
          <p>👉 Please select the exam on the right.</p>
        </div>

        <div class="exam-right">

          <div class="exam-box">
            ✔ True: <b><span id="rightCount">0</span></b><br>
            🎯 Exam Scores: <b><span id="score">0</span></b>
          </div>

          <div class="exam-box">
            <h3>Choose a topic</h3>
            <div id="examList" class="exam-list"></div>
          </div>

          <div class="exam-box exam-submit">
            <button id="btnSubmit" disabled>🚀 Submit</button>
            <button id="btnBack" class="btn-back">⬅ Home</button>
          </div>

        </div>
      </div>
    </div>
  `;

  document.getElementById("btnSubmit").onclick = submitExam;
  document.getElementById("btnBack").onclick = () => {
    if (confirm("Back to homepage ?")) {
      sessionStorage.removeItem("studentId");
      location.href = "/index.html";
    }
  };
}

/* ================= LOAD EXAM LIST ================= */
async function loadExamList() {
  const box = document.getElementById("examList");
  box.innerHTML = "";

  const tests =
    (await FirebaseService.get(`teacher/${TEACHER_ID}/test`)) || {};

  for (let i = 1; i <= 50; i++) {
    const id = i.toString().padStart(2, "0");
    const btn = document.createElement("button");
    btn.textContent = id;

    if (tests[id]) btn.onclick = () => startExam(id);
    else btn.disabled = true;

    box.appendChild(btn);
  }
}

/* ================= START EXAM ================= */
async function startExam(id) {
  examId = id;
  answers = {};
  isReviewMode = false;
  clearInterval(timer);

  examData = await FirebaseService.get(
    `teacher/${TEACHER_ID}/test/${examId}`
  );
  if (!examData?.questions) {
    alert("Đề chưa có dữ liệu");
    return;
  }

  // kiểm tra đã làm chưa
  const oldResult = await FirebaseService.get(
    `student/${studentId}/tests/exam_${examId}`
  );

  if (oldResult) {
    isReviewMode = true;
    answers = oldResult.answers || {};
    document.getElementById("btnSubmit").disabled = true;
    document.getElementById("rightCount").textContent = oldResult.right;
    document.getElementById("score").textContent = oldResult.score;
  } else {
    document.getElementById("btnSubmit").disabled = false;
    resetTimer();
    startTimer();
  }

  // random câu + đáp án
  examData.questions = shuffle(
    examData.questions.map(q => prepareQuestion(q))
  );

  renderQuestions();
}

/* ================= RENDER ================= */
function renderQuestions() {
  const box = document.getElementById("questionBox");

  box.innerHTML = examData.questions
    .map((q, i) => {
      const correct = q.correct;
      return `
      <div class="question">
        <div class="question-title">Câu ${i + 1}: ${q.q}</div>
        <div class="answers">
          ${q.options.map((opt, idx) => {
            let cls = "";
            if (isReviewMode) {
              if (idx === correct) cls = "style='border:2px solid #16a34a'";
              if (answers[i] === idx && idx !== correct)
                cls = "style='border:2px solid #f43f5e'";
            }
            return `
            <label ${cls}>
              <input type="radio"
                name="q${i}"
                ${answers[i] === idx ? "checked" : ""}
                ${isReviewMode ? "disabled" : ""}
                onchange="selectAnswer(${i},${idx})">
              ${opt}
            </label>
          `;
          }).join("")}
        </div>
      </div>
    `;
    })
    .join("");
}

/* ================= ANSWER ================= */
window.selectAnswer = function (q, o) {
  if (isReviewMode) return;
  answers[q] = o;
};

/* ================= SUBMIT ================= */
async function submitExam() {
  clearInterval(timer);

  let right = 0;
  examData.questions.forEach((q, i) => {
    if (answers[i] === q.correct) right++;
  });

  const score = (right * POINT_PER_QUESTION).toFixed(2);

  await FirebaseService.set(
    `student/${studentId}/tests/exam_${examId}`,
    { answers, right, score, finishedAt: Date.now() }
  );

  alert("Assignment Submitted");
  startExam(examId);
}

/* ================= TIMER ================= */
function startTimer() {
  timer = setInterval(() => {
    remainSeconds--;
    updateTimer();
    if (remainSeconds <= 0) submitExam();
  }, 1000);
}

function updateTimer() {
  const el = document.getElementById("timer");
  const m = Math.floor(remainSeconds / 60);
  const s = remainSeconds % 60;
  el.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

function resetTimer() {
  remainSeconds = EXAM_MINUTES * 60;
  updateTimer();
}

/* ================= HELPERS ================= */
function prepareQuestion(q) {
  const options = q.options.map(o => o.replace(/\*$/, ""));
  return {
    q: q.q,
    options: shuffle(options),
    correct: q.answer
  };
}

function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v);
}
