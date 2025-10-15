# Banner 管理說明文件

現在可以透過 Google Sheets 管理首頁 Banner 內容，不需要工程師改 code 就能更新！

## 設定步驟

### 1. 建立 Google Sheets

在 Google Sheets 建立一個新的試算表，格式如下：

| text                                                                            | actionable |
| ------------------------------------------------------------------------------- | ---------- |
| 近期地震導致壩體狀況不穩定，請確認已無風險後再進入災區 <光復鄉、鳳林鎮、萬榮鄉> | false      |
| 現場隨時有溢流風險，點此詳讀避難守則警報響起請往高處避難                        | true       |
| 光復鄉已恢復上班上課。下水道作業慎防沼氣，請勿點火！補水防中暑！                | false      |
| 請注意個人安全，結伴同行更安全                                                  | false      |
| 保持聯繫，手機保持電量                                                          | false      |

**欄位說明**

- `text`: Banner 要顯示的文字內容
- `actionable`: 是否可點擊
  - `true`: 點擊後會彈出警告視窗
  - `false`: 純資訊顯示，不可點擊

### 2. 設定 Google Sheets 權限

1. 點擊右上角的「共用」按鈕
2. 選擇「知道連結的任何人」都可以「檢視」
3. 複製試算表的 URL，格式像這樣：
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
   ```
4. 從 URL 中找到 `SHEET_ID`（上面例子中的 `1a2b3c4d5e6f7g8h9i0j`）

### 3. 設定環境變數

在專案的 `.env.local` 檔案中加入：

```bash
GOOGLE_SHEET_ID=你的_SHEET_ID
```

例如：

```bash
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j
```

### 4. 重新啟動開發伺服器

```bash
npm run dev
```

## 如何更新 Banner

1. 直接在 Google Sheets 中編輯內容
2. 儲存後，網站會在 60 秒內自動更新（有快取機制）
3. 如果要立即更新，重新載入網頁即可

## 注意事項

- **第一行（標題行）不會顯示**：請保持 `text` 和 `actionable` 作為標題
- **順序**：試算表中的順序就是 Banner 輪播的順序
- **刪除**：直接刪除整行即可移除該 Banner
- **新增**：在試算表最後新增一行即可加入新的 Banner
- **快取**：資料會快取 60 秒，所以更新後可能需要等一下才會生效
- **容錯機制**：如果 Google Sheets 無法存取，會顯示預設的 Banner 內容

## 範例試算表

可以複製這個範例試算表開始使用：[範例試算表](https://docs.google.com/spreadsheets/d/1ZV4Ci_GpTC4Yv5WSQUNH3L_1AgBTolTbUr8Ll4MOx_Y/edit?gid=0#gid=0)

## 常見問題

**Q: 更新後沒有立即生效？**
A: 因為有 60 秒快取，請稍等片刻或重新整理頁面。

**Q: 可以使用多行文字嗎？**
A: 目前不支援，請將所有文字放在同一格內。
