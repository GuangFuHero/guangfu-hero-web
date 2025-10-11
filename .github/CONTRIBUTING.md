# 🧩 Contributing Guide

感謝你願意為本專案做出貢獻！  
以下是標準的 **前端開發貢獻流程**，請在建立 PR 前閱讀並遵守，以確保協作順暢與代碼品質一致。

## 🪄 基本原則

- 主分支：`dev`
- 所有開發皆需 **從 `dev` 切出 feature branch**
- 完成後以 **`dev` 為 base 開 PR**
- 維持 **小步提交、乾淨 commit、明確命名**

## 🧱 開發流程

### 1. 取得最新 `dev` 分支

```bash
git checkout dev
git pull origin dev
npm install        # 或 yarn install / pnpm i
npm run build # 確認能正常編譯
```

### 2. 建立新分支

**命名規範**

| 類型 | 範例命名                     | 用途           |
| ---- | ---------------------------- | -------------- |
| 功能 | `feature/report-date-picker` | 新增功能       |
| 修正 | `fix/login-button-style`     | 修 Bug         |
| 重構 | `refactor/state-store`       | 調整架構、邏輯 |
| 文件 | `docs/update-readme`         | 更新文件       |

```bash
git checkout -b feature/<scope>-<topic>
```

### 3. 撰寫程式與 Commit

**建議使用 Conventional Commits 規範**

```bash
# 範例
git add -A
git commit -m "feat(report): add date picker to filter panel"
git commit -m "fix(ui): adjust dropdown z-index in modal"
```

**常見類型**

| 類型     | 說明           |
| -------- | -------------- |
| feat     | 新功能         |
| fix      | 錯誤修正       |
| refactor | 程式重構       |
| chore    | 建構、設定調整 |
| docs     | 文件更新       |
| test     | 測試相關修改   |

### 4. 與 `dev` 保持同步

開發期間請定期同步，以減少衝突：

```bash
git fetch origin
git checkout dev && git pull origin dev
git checkout feature/<branch>
git rebase dev
# 若有衝突，解完後：
git add -A
git rebase --continue
git push --force-with-lease
```

### 5. 提交前自我檢查（DoD）

✅ 請確認以下項目：

- [ ] 通過 lint、build、typecheck
- [ ] 單元測試與 E2E 測試（若有）皆通過
- [ ] 無多餘 `console.log` 或暫時註解
- [ ] 程式碼命名一致、可讀性佳
- [ ] UI/UX 驗證完成（RWD、暗色模式、多瀏覽器）
- [ ] 有附上必要的截圖、影片或 Demo 連結
- [ ] 若涉及 API，schema 或 mock 已同步更新

### 6. 建立 Pull Request

- **Base branch**：`dev`

- **PR 標題** 建議遵守 Conventional Commits（與 commit 類似）

  例如：

  ```
  feat(report): add date picker to filter panel
  fix(auth): correct login redirect logic
  ```

- **PR Template**：請使用內建模板，補上：
  - Summary / Context
  - Main Changes
  - Test Plan
  - UI/UX Before/After
  - Reviewer Focus / Checklist

### 7. Code Review 流程

1. 指定至少一位 reviewer

2. 根據回饋修正：

   ```bash
   git commit -m "fix: address review comments"
   git push
   ```

3. 通過 CI / 測試後由 Maintainer 進行合併。

### 8. 合併策略

🔹 **Squash & Merge（推薦）**
將多個 commit 合併成一個，保持乾淨歷史。

- 請保留 PR 標題與重點內容作為最終 commit message
- 合併後刪除分支：

```bash
git branch -d feature/<branch>
git push origin :feature/<branch>
```

### 9. 常見問題處理

| 狀況       | 解法                                      |
| ---------- | ----------------------------------------- |
| PR 太大    | 拆分為多個小 PR，使用 Draft PR 先預覽方向 |
| 發生衝突   | 使用 `rebase dev` 解決，避免 merge commit |
| CI 不穩定  | 先本地測試、確認版本與環境一致            |
| API 有變更 | 同步更新 mock / schema / 型別並標註於 PR  |

## 📚 文件與連結

| 項目           | 路徑 / 說明                        |
| -------------- | ---------------------------------- |
| PR 模板        | `.github/PULL_REQUEST_TEMPLATE.md` |
| 專案說明       | `README.md`                        |
| 設計稿 / Figma | _(如有，補上連結)_                 |

## ❤️ 小提醒

- 保持 commit 小而清晰
- PR 描述盡可能完整（讓 reviewer 不需追問）
- 若為 UI 改動，附上前後對照圖
- Review 意見若非 blocking，可使用「後續追蹤 issue」處理

感謝你為這個專案貢獻力量 🎉
你的每一次 PR 都讓專案更好！
