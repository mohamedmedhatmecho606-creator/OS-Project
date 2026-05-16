# 🚀 OS Scheduler Engine

<div align="center">

### Advanced CPU Scheduling Simulator

Interactive Operating System Scheduling Visualizer built using **HTML, CSS, and JavaScript**.

</div>

---

# 📖 Overview

This project is a modern CPU Scheduling Simulator designed to demonstrate core **Operating System scheduling algorithms** through dynamic execution, real-time calculations, and visual Gantt chart representations.

The simulator allows users to enter processes, configure scheduling parameters, and compare how different CPU scheduling algorithms behave under the exact same workload.

It focuses on:

* Accurate scheduling simulation
* Clean visualization of execution flow
* Real-time metric calculations
* Educational understanding of CPU Scheduling concepts
* Interactive browser-based execution

---

# ✨ Key Features

* 🧠 Supports multiple CPU Scheduling Algorithms
* 📊 Dynamic Gantt Chart Visualization
* ⚡ Real-Time Metrics Calculation
* 🎯 Interactive Process Input System
* 🔄 Automatic Waiting Time & Turnaround Time Computation
* 📈 Average Metrics Analysis
* 🎨 Responsive and Clean User Interface
* 💻 Pure Frontend Implementation (No Backend Required)
* 🛠 Modular JavaScript Architecture

---

# 🧩 Implemented Algorithms

1. **Round Robin (RR)**

   * Preemptive scheduling
   * Uses configurable Time Quantum for fair CPU allocation

2. **Priority Scheduling**

   * Executes processes according to assigned priorities
   * Supports priority-based execution logic

---

# 🏗️ Project Architecture

```bash
project/
│
├── index.html          # Main application interface
├── style.css           # UI styling and layout
│
├── input.js            # Handles process input and validation
├── gantt.js            # Generates Gantt chart visualization
├── metrics.js          # Calculates WT, TAT, CT and averages
├── comparison.js       # Compares scheduling performance
│
├── priority.js         # Priority Scheduling implementation
├── roundrobin.js       # Round Robin algorithm implementation
│
└── README.md           # Project documentation
```

---

# 📊 Calculated Metrics

The simulator calculates the following scheduling metrics:

| Metric      | Description             |
| ----------- | ----------------------- |
| **WT**      | Waiting Time            |
| **TAT**     | Turnaround Time         |
| **CT**      | Completion Time         |
| **RT**      | Response Time           |
| **AVG WT**  | Average Waiting Time    |
| **AVG TAT** | Average Turnaround Time |

---

# 🎨 Gantt Chart Visualization

The simulator generates a visual Gantt Chart to represent:

* CPU execution order
* Context switching
* Process execution intervals
* Idle CPU periods
* Time progression

This makes it easier to analyze and compare scheduling behaviors visually.

---

# ⚙️ Technologies Used

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| HTML5            | Structure & Layout              |
| CSS3             | Styling & Responsive Design     |
| JavaScript (ES6) | Scheduling Logic & Calculations |

---

# 🚀 How to Run the Project

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
```

## 2️⃣ Open the Project

Open the project folder in:

* VS Code
* WebStorm
* Any modern code editor

## 3️⃣ Run the Application

Simply open:

```bash
index.html
```

inside your browser.

---

# 🖥️ Example Input

| Process | Arrival Time | Burst Time | Priority |
| ------- | ------------ | ---------- | -------- |
| P1      | 0            | 5          | 2        |
| P2      | 1            | 3          | 1        |
| P3      | 2            | 8          | 4        |
| P4      | 3            | 6          | 3        |

---

# 📈 Educational Objectives

This project demonstrates:

* CPU Scheduling Concepts
* Preemptive vs Non-Preemptive Scheduling
* Operating System Process Management
* Algorithm Performance Comparison
* JavaScript DOM Manipulation
* Frontend Visualization Techniques

---

# 🔮 Future Improvements

* ✅ Add Multi-Level Queue Scheduling
* ✅ Add Multi-Level Feedback Queue (MLFQ)
* ✅ Add Process Animation
* ✅ Export Results as PDF
* ✅ Add Dark/Light Theme Toggle
* ✅ Add Real-Time Simulation Speed Control

---

# 👨‍💻 Author

Developed as an Operating System Scheduling Simulation Project.

---

# ⭐ Project Highlights

✔ Clean Architecture

✔ Interactive Visualization

✔ Educational OS Simulation

✔ Modular JavaScript Design

✔ Easy to Extend with New Algorithms

---

<div align="center">

### 🚀 CPU Scheduling Made Visual & Interactive

</div>
