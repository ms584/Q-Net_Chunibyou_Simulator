# ⚡ Q-Net Interplanetary Simulator

> **Sprint 4 Build** — Web dashboard จำลองระบบสื่อสารเชิงควอนตัม (Quantum Networking) ระหว่างดาวเคราะห์และดาวฤกษ์ใกล้เคียง โดยเปรียบเทียบ **Classic TCP/IP** กับ **Q-Net Warp Transmission** แบบ Real-time

🌐 **Live Demo:** [https://q-net-chunibyou-simulator.onrender.com](https://q-net-chunibyou-simulator.onrender.com)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## Tech Stack

| หมวด | เทคโนโลยี |
|------|-----------|
| **Framework** | [React 18](https://react.dev/) via [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite` plugin) |
| **Icons** | [lucide-react](https://lucide.dev/) |
| **Animation** | HTML5 Canvas API (vanilla, no library) |
| **Font** | [Orbitron](https://fonts.google.com/specimen/Orbitron) + [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) (Google Fonts) |
| **Language** | JavaScript (JSX) |
| **Package Manager** | npm |

### โครงสร้างโปรเจกต์

```
Q-Net_webUI/
├── src/
│   ├── systems.js              ← ข้อมูลระบบดาว (ระยะทาง, Latency, สี)
│   ├── App.jsx                 ← Root component + state management
│   ├── index.css               ← Global CSS + Tailwind + cyberpunk variables
│   └── components/
│       ├── Header.jsx          ← Header bar + active target indicator
│       ├── SpaceCanvas.jsx     ← Canvas animation (โลก, ดาว, warp packets)
│       ├── StatsSidebar.jsx    ← Fidelity bars + Latency Savings panel
│       ├── ControlPanel.jsx    ← Mode toggle + Destination selector + Execute button
│       └── ConsoleLog.jsx      ← Streaming system log (Q-CAST / TCP)
├── index.html
├── vite.config.js
└── package.json
```

---

## วิธีติดตั้งและรัน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รัน Dev Server
npm run dev

# 3. เปิด browser
# http://localhost:5173/
```

---

## วิธีเล่น (How to Use)

### 1. เลือกโหมดการส่ง (Transmission Mode)

ที่ **Control Panel** ด้านล่างซ้าย มีปุ่ม 2 โหมด:

| ปุ่ม | ความหมาย |
|------|----------|
| 📡 **CLASSIC TCP/IP** | จำลองการส่งสัญญาณแบบคลื่นแม่เหล็กไฟฟ้าทั่วไป ความเร็วสูงสุด = ความเร็วแสง → Latency มหาศาล |
| ⚡ **Q-NET WARP** | จำลออง Quantum Teleportation ผ่าน Collapse Modulation → Setup Time แทบ 0 |

---

### 2. เลือกปลายทาง (Destination)

กดปุ่มชื่อดาวที่ต้องการในส่วน **SELECT DESTINATION**:

| ปลายทาง | ระยะทาง | RTT แบบ Classic |
|---------|---------|----------------|
| **♂ MARS** | 22 light-min | **44 นาที** |
| **PROXIMA** (Proxima Centauri) | 4.24 ปีแสง | **8.48 ปี** |
| **α CENTAURI** (Alpha Centauri) | 4.37 ปีแสง | **8.74 ปี** |
| **★ SIRIUS** | 8.60 ปีแสง | **17.2 ปี** |

> เมื่อเปลี่ยนปลายทาง ตัวเลข **Latency Savings** บนแถบขวาจะเปลี่ยนทันที

---

### 3. กด Execute Warp

- **Q-Net mode** → กด `⚡ EXECUTE WARP` เพื่อจุดชนวน Warp Burst — ดูการระเบิดสีม่วงบน canvas และ log ที่สตรีมใน console
- **Classic mode** → กด `📡 SEND TCP SYN` เพื่อดูการ handshake ที่ล้มเหลวเพราะ Timeout มหาศาล

---

### 4. อ่าน Stats

| Panel | แสดงอะไร |
|-------|---------|
| **Quantum Fidelity** | ความบริสุทธิ์ของ Quantum Channel (Q-Net = 99.09%, Classic = 72.4%) |
| **Latency Savings** | เวลาที่ประหยัดได้เทียบ Classic RTT — เปลี่ยนตามดาวที่เลือก |
| **Connection Layer** | Backend: `ibm_marrakesh` (IBM Eagle r3, 127 Qubits) |
| **Telemetry** | QBER, Ebit Rate, Protocol, Repeater count |

---

### 5. Console Log

ด้านล่างกลาง แสดง log สตรีมแบบ real-time:

- `SYS` — System events
- `QCAST` — Q-CAST Routing layer (Entanglement swapping, path entropy)
- `MOD` — Collapse Modulation engine (error correction, Pauli-X, Bell state)
- `TCP` — Classic 3-way handshake events
- `WARN` — คำเตือนเมื่อ Latency เกิน threshold

---

## เกี่ยวกับโปรเจกต์ Q-Net

Q-Net คืองานวิจัยจำลองโปรโตคอล Quantum Networking ระดับ Interplanetary/Interstellar โดยใช้เทคนิค:
- **Collapse Modulation** — การ encode ข้อมูลผ่าน Quantum Collapse
- **Q-CAST Routing** — Multi-hop Entanglement Swapping
- **Error Correction** — Surface-17 Code, Syndrome extraction, Pauli-X correction
- **Backend** — IBM Quantum (ibm_marrakesh, Eagle r3) ผ่าน Sprint 4 integration

---

*Build: Sprint 4 · March 2026 · ibm_marrakesh · VER 4.0.1*
