# Smart QR Attendance System

A simple, mobile-friendly **QR based student attendance system** built using **HTML, CSS, JavaScript, Bootstrap and browser localStorage** (no backend / server required).

Live Demo:  
`https://suryasingh072.github.io/QR-Attendance-System/index.html`

---

## 🎯 Project Overview

Is project ka main goal hai:

- QR code se **fast & error-free attendance** lena  
- Teacher/admin ko **clean dashboard** dena  
- **Subject + Class wise** attendance manage karna  
- Student ke liye **unique QR code** generate karna  
- Sab kuch **100% frontend** (sirf browser + localStorage)

Ye project college mini/micro project, lab practical, ya demo ke liye perfect hai.

---

## ✨ Features

### 🔐 Login System
- Simple login screen  
- Default credentials:
  - **Username:** `admin`
  - **Password:** `1234`
- Login hone ke baad dashboard open hota hai  
- Direct dashboard/generator URL open karne pe agar login nahi hai to **index page pe redirect**  

---

### 🎓 Student QR Generator (Student Side Setup)
- Alag page: **Student QR Generator**
- Har student ke liye:
  - **Name + Unique Roll No** save hota hai (browser `localStorage` me)
  - **QR code generate hota hai** (QR me roll no store hota hai)
- Student list dikhai deti hai:
  - `Name (Roll)` format me
  - Har student ke liye:
    - **Show QR** button (screen pe QR dekhne ke liye)
    - **Parent QR Print** button (parent ke liye print‐friendly QR)

---

### 🧑‍🏫 Teacher Dashboard

- **Class Selection** – e.g. `B.Tech CSE`, `B.Tech IT`, `BCA`
- **Subject Selection** – e.g. `Maths`, `Physics`, `C Programming`, etc.
- **QR Scanner Section**:
  - Mobile/PC camera use karke QR scan
  - QR se **roll no detect** hota hai
  - “Mark Attendance” button dabane par:
    - Roll se student ka name fetch hota hai (student list se)
    - Current date/time ke saath attendance save ho jata hai
    - Same student ke liye **duplicate attendance block** ho jati hai (same din, same class+subject)

- **Attendance Table**:
  - Columns: **Name | Roll | Time**
  - Class + Subject + Current Date ke hisaab se records show hote hain

- **Attendance % Calculation**:
  - Total registered students (student list) ke against
  - Present students count se **auto % calculate** hoti hai  
  - Example: 10 students list me, 7 present → `70%` show hoga

---

### 🌗 Dark / Light Mode

- Dashboard par **🌗 toggle button**
- Background + cards light/dark theme follow karte hain
- Purely CSS + JS based, localStorage use nahi kiya gaya (simple toggle)

---

### 📂 Data Storage

- **No backend, no database server**
- Sab data browser ke **`localStorage`** me store hota hai:

| Key Pattern                         | Description                            |
|-------------------------------------|----------------------------------------|
| `students`                          | Array of `{ name, roll }`             |
| `att_<Class>_<Subject>_<YYYY-MM-DD>` | Attendance records for that day/class/subject |

Example key:  
`att_B.Tech CSE_Maths_2025-12-04`

---

### 📤 Export to Excel

- Attendance table ke niche **"Export to Excel"** button
- Current attendance table ko **`.xls` format** me export karta hai
- Excel / LibreOffice me easily open ho jata hai

---

## 🏗️ Tech Stack

- **HTML5** – UI structure  
- **CSS3 + Custom styling** – Glassmorphism + gradient background  
- **Bootstrap 5** – Responsive layout & basic components  
- **JavaScript (Vanilla)** – Logic, QR scanning, attendance storage  
- **[html5-qrcode](https://github.com/mebjas/html5-qrcode)** – QR Code scanning (camera access)  
- **[qrcodejs](https://github.com/davidshimjs/qrcodejs)** – QR Code generation  
- **localStorage** – Browser-side data persistence  

---

## 📁 Project Structure

```text
QR-Attendance-System/
│
├── index.html        # Login page
├── dashboard.html    # Teacher dashboard (scanner + attendance)
├── generator.html    # Student QR generator + student list + parent QR
├── style.css         # Shared styling (background + glass effect + theme)
└── script.js         # All JS logic (auth, QR gen, scan, attendance, export)
