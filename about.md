# Creator Collaboration & Campaign Management System
A complete, responsive web app built with **HTML + CSS + JavaScript** using **Local Storage** for persistence. No frameworks, no backend — perfect for a college project.
## 🚀 Demo Login
- **Username:** `admin`
- **Password:** `12345`
## 📁 Folder Structure
```
Creator-Collaboration-System/
├── index.html              # Login page
├── dashboard.html          # Dashboard with stats + module cards
├── creator.html            # Creator Hub (CRUD + search + status)
├── scripts.html            # Script Vault (CRUD + search + modal)
├── collaboration.html      # Collaboration Desk (campaigns / dispatch / deliverables)
│
├── css/
│   ├── common.css          # Design system (colors, typography, buttons, tables…)
│   ├── login.css           # Glassmorphism login
│   ├── dashboard.css       # Stat cards & module cards
│   ├── creator.css
│   ├── scripts.css
│   └── collaboration.css
│
├── js/
│   ├── storage.js          # Centralized Local Storage CRUD utilities
│   ├── login.js
│   ├── dashboard.js
│   ├── creator.js
│   ├── scripts.js
│   └── collaboration.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```
## ✨ Features
- ✅ Full CRUD on Creators, Scripts, Collaborations, Dispatches, Deliverables
- 🔍 Real-time search/filter
- 📊 Live dashboard statistics from Local Storage
- 🎨 Glassmorphism login, modern admin UI
- 🧮 Form validation (required fields, email, numeric)
- 🔔 Toast notifications
- ❓ Confirmation modals before delete
- 🔄 Inline status update dropdowns
- 📱 Fully responsive (mobile, tablet, desktop)
## 🎨 Theme
| Token     | Value     |
| --------- | --------- |
| Primary   | `#6B8E7A` |
| Secondary | `#DCE8E1` |
| Accent    | `#F4F7F5` |
| Text      | `#333333` |
## ▶️ How to Run
1. Download / copy the `Creator-Collaboration-System/` folder.
2. Open `index.html` in any browser.
3. Log in with `admin / 12345`.
4. Explore Creator Hub, Script Vault, and Collaboration Desk.
All data is saved to your browser's Local Storage — clearing site data resets the app.
## 🗂 Local Storage Keys
| Key              | Stores                |
| ---------------- | --------------------- |
| `creators`       | Creator records       |
| `scripts`        | Script vault          |
| `collaborations` | Campaigns             |
| `dispatches`     | Product dispatch logs |
| `deliverables`   | Deliverables          |
| `cc_auth`        | Login session         |
All read/write operations go through `js/storage.js` (`saveData`, `getData`, `updateData`, `deleteData`).
