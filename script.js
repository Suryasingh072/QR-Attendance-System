/***********************
 *  AUTH / LOGIN CHECK *
 ***********************/
(function () {
  const file = window.location.pathname.split("/").pop();
  // Agar dashboard ya generator open ho raha hai aur login nahi, to index.html pe bhej do
  if ((file === "dashboard.html" || file === "generator.html") &&
      !localStorage.getItem("user")) {
    window.location.href = "index.html";
  }
})();

function login() {
  const uEl = document.getElementById("username");
  const pEl = document.getElementById("password");
  if (!uEl || !pEl) return;

  const u = uEl.value.trim();
  const p = pEl.value.trim();

  if (u === "admin" && p === "1234") {
    localStorage.setItem("user", u);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password (demo: admin / 1234)");
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}


/**************************
 *  DARK / LIGHT MODE     *
 **************************/
function toggleMode() {
  const body = document.getElementById("mainBody") || document.body;
  body.classList.toggle("light-mode");
}


/**************************
 *  STUDENT MASTER DATA   *
 **************************/
function getStudents() {
  return JSON.parse(localStorage.getItem("students") || "[]");
}
function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}


/**********************************
 *  STUDENT QR GENERATOR (PAGE)   *
 **********************************/
function generateQR() {
  const nameInput = document.getElementById("studentName");
  const rollInput = document.getElementById("rollNo");
  const qrDiv = document.getElementById("qrcode");

  if (!nameInput || !rollInput || !qrDiv) return;

  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();

  if (!name || !roll) {
    alert("Please enter Student Name and Unique Roll No");
    return;
  }

  let students = getStudents();
  const existingIndex = students.findIndex(s => s.roll === roll);

  if (existingIndex >= 0) {
    students[existingIndex].name = name; // update name if roll already exists
  } else {
    students.push({ name, roll });
  }
  saveStudents(students);

  qrDiv.innerHTML = "";
  if (typeof QRCode !== "undefined") {
    new QRCode(qrDiv, {
      text: roll,
      width: 180,
      height: 180
    });
  } else {
    alert("QR library not loaded.");
  }

  renderStudentList();
}

function renderStudentList() {
  const ul = document.getElementById("studentList");
  if (!ul) return;

  let students = getStudents();
  ul.innerHTML = "";

  students.forEach(s => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const span = document.createElement("span");
    span.textContent = `${s.name} (${s.roll})`;

    const btnGroup = document.createElement("div");

    const btnShowQR = document.createElement("button");
    btnShowQR.className = "btn btn-sm btn-outline-primary me-2";
    btnShowQR.textContent = "Show QR";
    btnShowQR.onclick = () => {
      const qrDiv = document.getElementById("qrcode");
      if (qrDiv && typeof QRCode !== "undefined") {
        qrDiv.innerHTML = "";
        new QRCode(qrDiv, { text: s.roll, width: 180, height: 180 });
      }
    };

    const btnPrint = document.createElement("button");
    btnPrint.className = "btn btn-sm btn-dark";
    btnPrint.textContent = "Parent QR Print";
    btnPrint.onclick = () => printQRForParent(s.roll);

    btnGroup.appendChild(btnShowQR);
    btnGroup.appendChild(btnPrint);

    li.appendChild(span);
    li.appendChild(btnGroup);
    ul.appendChild(li);
  });
}

// Auto-call on generator page
if (document.getElementById("studentList")) {
  renderStudentList();
}

// Parent QR print
function printQRForParent(roll) {
  const section = document.getElementById("printSection");
  const box = document.getElementById("printQR");
  if (!section || !box) return;

  section.style.display = "block";
  box.innerHTML = "";
  if (typeof QRCode !== "undefined") {
    new QRCode(box, {
      text: roll,
      width: 200,
      height: 200
    });
  }
  section.scrollIntoView({ behavior: "smooth" });
}


/**********************************
 *  QR SCANNER (DASHBOARD)        *
 **********************************/
function onScanSuccess(decodedText) {
  const qrInput = document.getElementById("qrData");
  if (qrInput) qrInput.value = decodedText;
}

if (document.getElementById("reader") && typeof Html5QrcodeScanner !== "undefined") {
  const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
  scanner.render(onScanSuccess);
}


/**********************************
 *  ATTENDANCE LOGIC              *
 **********************************/
function getAttendanceKey() {
  const classEl = document.getElementById("className");
  const subjectEl = document.getElementById("subjectName");
  const cls = classEl ? classEl.value : "Class";
  const sub = subjectEl ? subjectEl.value : "Subject";
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `att_${cls}_${sub}_${today}`;
}

function markAttendance() {
  const qrInput = document.getElementById("qrData");
  if (!qrInput) return;

  const roll = qrInput.value.trim();
  if (!roll) {
    alert("Scan QR first");
    return;
  }

  const students = getStudents();
  const student = students.find(s => s.roll === roll);

  if (!student) {
    const ok = confirm("Student not found in list. Mark as Unknown?");
    if (!ok) return;
  }

  const key = getAttendanceKey();
  let data = JSON.parse(localStorage.getItem(key) || "[]");

  if (data.some(r => r.roll === roll)) {
    alert("Attendance already marked for this student");
    return;
  }

  data.push({
    name: student ? student.name : "Unknown",
    roll: roll,
    time: new Date().toLocaleTimeString()
  });

  localStorage.setItem(key, JSON.stringify(data));
  qrInput.value = "";
  loadTable();
}

function loadTable() {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  const key = getAttendanceKey();
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  tbody.innerHTML = "";
  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.name}</td><td>${r.roll}</td><td>${r.time}</td>`;
    tbody.appendChild(tr);
  });

  const percentSpan = document.getElementById("percent");
  if (percentSpan) {
    const total = getStudents().length || 0;
    const percent = total ? Math.round((data.length / total) * 100) : 0;
    percentSpan.textContent = percent + "%";
  }
}

// Bind class/subject change on dashboard
const classSelect = document.getElementById("className");
const subjectSelect = document.getElementById("subjectName");
if (classSelect) classSelect.addEventListener("change", loadTable);
if (subjectSelect) subjectSelect.addEventListener("change", loadTable);
loadTable();


/**********************************
 *  EXPORT TO EXCEL               *
 **********************************/
function exportExcel() {
  const table = document.querySelector("table");
  if (!table) {
    alert("No table found");
    return;
  }

  const html = table.outerHTML;
  const a = document.createElement("a");
  a.href = "data:application/vnd.ms-excel," + encodeURIComponent(html);
  a.download = "attendance.xls";
  a.click();
}
