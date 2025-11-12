# 光復超人 GuangFu Hero

中文版 | [English](./README.md)

> 無論在哪裡，都能成為光復的超人

花蓮災害救援協調平台，連結志工與居民。由遠端志工團隊共同打造，用專業技能支援災區救援工作。

## 🎯 專案簡介

**光復超人**是一個由「遠端志工」、「鍵盤志工」共同打造的網路平台。我們無法親臨現場，卻同樣想為這片土地盡一份力。我們用彼此的專業與行動，在線上建立出一套能支援現場的資訊系統。

## ✨ 主要功能

### 🧭 志工指引

- 行前資訊與新手導引
- 報到與登記流程
- 交通資訊
- 裝備與準備清單
- 在地社群與團隊連結

### 🗺️ 災區互動地圖

- 醫療站與衛生設施
- 物資配送點
- 公共設施（廁所、盥洗室）
- 志工即時位置資訊

### 💬 居民協助系統

- 醫療協助需求
- 心理健康資源
- 收容所資訊
- 居民直接登記需求
- 即時媒合可用志工

### 🐝 物資媒合（小蜜蜂系統）

- 物資配送協調
- 機車志工（小蜜蜂）派遣
- 從提交到送達的需求追蹤
- 整合物資站資訊

## 🛠️ 技術架構

- **框架**: [Next.js](https://nextjs.org) 15.5.4 with Turbopack
- **UI 函式庫**: [React](https://react.dev) 19.1.0
- **程式語言**: [TypeScript](https://www.typescriptlang.org) 5
- **樣式**: [Tailwind CSS](https://tailwindcss.com) 4
- **分析**: Google Analytics 4
- **工具**: dayjs 處理日期時間

## 🚀 開始使用

### 環境需求

- Node.js 20+
- npm、yarn、pnpm 或 bun

### 安裝步驟

1. 複製專案：

```bash
git clone https://github.com/GuangFuHero/guangfu-hero-web-org.git
cd guangfu-hero-web-org
```

2. 安裝相依套件：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 啟動開發伺服器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

4. 在瀏覽器開啟 [http://localhost:3000](http://localhost:3000)

應用程式會自動重新導向至地圖頁面（`/map`）。

### 可用指令

- `npm run dev` - 使用 Turbopack 啟動開發伺服器
- `npm run build` - 使用 Turbopack 建置正式版本
- `npm start` - 啟動正式版本伺服器
- `npm run lint` - 執行 ESLint

## 📁 專案結構

```
src/
├── app/
│   ├── map/              # 災區互動地圖
│   ├── full-screen-map/  # 全螢幕地圖檢視
│   ├── victim/           # 居民協助頁面
│   │   ├── house-repair/ # 居家修繕廠商
│   │   ├── medical/      # 醫療協助(不使用)
│   │   ├── mental-health/# 心理健康資源
│   │   ├── shelter/      # 收容所資訊(不使用)
│   │   ├── site/         # 光復站點
│   │   └── support-information/ # 補助貸款
│   ├── volunteer/        # 志工資訊
│   │   ├── about-us/     # 團隊資訊
│   │   ├── preparation/  # 裝備清單
│   │   ├── transportation/ # 交通資訊
│   │   └── accommodations/ # 住宿資訊
│   ├── resources/        # 物資媒合系統
│   ├── volunteer-register/ # 志工登記
│   ├── supply-depot-form-2/ # 物資站表單
│   ├── auth/             # 身份驗證
│   │   └── line/         # LINE 登入
│   ├── privacy/          # 隱私權政策
│   └── terms/            # 使用條款
├── components/           # 可重複使用的 UI 元件
│   ├── ActionButton/     # 行動按鈕
│   ├── AlertBanner/      # 警告橫幅
│   ├── Button/           # 基本按鈕
│   ├── DropdownSelect/   # 下拉選單元件
│   ├── PageLayout/       # 頁面佈局包裝器
│   ├── Sidebar/          # 導航側邊欄
│   ├── Toast/            # 提示通知
├── features/             # 功能專屬元件
│   ├── MapContainer/     # 地圖功能
│   │   ├── ReactLeafletMap/ # Leaflet 地圖整合
│   │   ├── InfoSidebar/  # 地圖資訊面板
│   │   ├── Modals/       # 地圖相關對話框
│   │   └── ...          # 其他地圖功能
│   ├── SiteMap/          # 網站地圖元件
│   ├── PlaceList/        # 地點列表功能
│   ├── VictimAssistance/ # 災民支援功能
│   ├── VolunteerInfo/    # 志工資訊
│   ├── SupplyDepot/      # 物資管理
│   ├── Resources/        # 物資媒合
│   ├── AboutUs/          # 關於團隊頁面
├── lib/                  # 工具函式與 API
├── hooks/                # 自訂 React Hooks
├── providers/            # React Context
```

## 👥 團隊

本平台由分散各地的遠端志工團隊日夜接力開發維護：

- **網站更新組** - 前端與後端開發
- **地圖組** - GIS 資料與地圖整合
- **設計組** - UI/UX 設計
- **核實組** - 資料驗證
- **宣傳組** - 社群推廣
- **DC 管理組** - Discord 社群管理
- **公關組** - 對外溝通

完整團隊名單請見[關於我們](/volunteer/about-us)頁面。

## 🤝 參與貢獻

我們歡迎志工貢獻！這是持續進行的救援工作，我們感謝：

- 錯誤回報與修正
- 功能建議與實作
- 文件改進
- 翻譯協助
- 設計改善

### 開發流程

1. Fork 此專案
2. 建立功能分支：`git checkout -b feat/your-feature`
3. 進行變更
4. 完整測試
5. 清楚地提交變更
6. 推送至您的 Fork
7. 開啟 Pull Request 至 `dev` 分支

### 分支策略

- `main` - 正式環境分支
- `dev` - 開發分支（PR 目標分支）
- `feat/*` - 功能分支

## 📜 授權

本專案為公開專案，由光復超人志工團隊維護。

## 💝 使命

> 救災不只是短暫的行動，而是一場持續的接力。

無論在現場或遠端，每個人都能成為光復的超人。

---

由遠端志工用 ❤️ 為花蓮社群打造
