# Angular 記憶體洩漏示範專案

這個專案展示了 Angular 應用程式中常見的記憶體洩漏問題以及如何正確地避免這些問題。透過實際的範例，您可以了解訂閱（Subscription）未正確處理所導致的記憶體洩漏及其解決方案。

## 專案介紹

本專案包含兩個主要元件：
- **記憶體洩漏元件 (LeakingComponent)** - 展示常見的記憶體洩漏問題
- **無記憶體洩漏元件 (NonLeakingComponent)** - 展示正確的處理方式

同時提供了檢測工具與說明，幫助您了解如何發現及解決 Angular 應用中的記憶體洩漏。

## 安裝與執行

### 必要條件
- Node.js (建議使用 v14 或更新版本)
- npm (通常隨 Node.js 一起安裝)
- Angular CLI (建議使用 v13 或更新版本)

### 安裝步驟

1. 複製專案到本地端
```bash
git clone [專案URL]
cd test
```

2. 安裝相依套件
```bash
npm install
```

3. 啟動開發伺服器
```bash
ng serve --open
```

應用將自動在瀏覽器中開啟 (通常是 http://localhost:4200)。

## 專案結構說明

- **app.component.ts** - 主應用元件，提供切換不同示範的介面
- **data.service.ts** - 資料服務，提供可觀察資料流
- **leaking.component.ts** - 展示記憶體洩漏問題的元件
- **non-leaking.component.ts** - 展示正確處理方式的元件
- **memory-test.component.ts** - 記憶體洩漏檢測工具元件
- **app-routing.module.ts** - 路由設定模組

## 記憶體洩漏問題說明

### 導致記憶體洩漏的常見原因

1. **未取消的訂閱**：當元件被銷毀時，未正確取消 Observable 訂閱
2. **未移除的事件監聽器**：DOM 事件監聽器未在元件被銷毀時移除
3. **定時器未清除**：未正確清除 setTimeout 或 setInterval
4. **閉包中保留對大型物件的引用**：特別是在長時間運行的訂閱回調函數中

### 洩漏元件的問題

在 `LeakingComponent` 中，當元件訂閱了資料服務的 Observable，但沒有在元件銷毀時取消訂閱：

```typescript
ngOnInit(): void {
  this.subscription = this.dataService.getDataStream().subscribe(data => {
    this.currentData = data;
    console.log('洩漏元件收到:', data);
  });
}
// 缺少 ngOnDestroy 方法來清理訂閱
```

當此元件從 DOM 中移除後，訂閱依然存在，導致：
- 不必要的記憶體使用
- 不必要的計算開銷
- 可能的意外行為
- 隨時間累積的效能問題

### 正確的處理方式

在 `NonLeakingComponent` 中展示了兩種處理方式：

1. **使用 takeUntil 與 Subject** (推薦方式)：
```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.dataService.getDataStream()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { /* ... */ });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

2. **直接取消訂閱** (替代方式)：
```typescript
private subscription: Subscription;

ngOnInit(): void {
  this.subscription = this.dataService.getDataStream().subscribe(/* ... */);
}

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
```

## 如何檢測記憶體洩漏

### 方法 1：觀察控制台輸出

1. 開啟瀏覽器開發者工具 (F12)
2. 切換到 Console 標籤
3. 顯示洩漏元件，然後點擊「清除全部」隱藏元件
4. 觀察控制台是否繼續顯示 "洩漏元件收到:" 的訊息
   - 如果元件被移除後仍看到訊息，表示存在記憶體洩漏
   - 正確的實作應該會停止訊息輸出，且顯示清理訊息

### 方法 2：使用 Chrome 記憶體工具

1. 開啟 Chrome 開發者工具 (F12)
2. 切換到 Memory 標籤
3. 選擇 "Heap snapshot"
4. 執行下列步驟：
   - 拍攝初始快照
   - 多次切換顯示/隱藏洩漏元件
   - 拍攝另一個快照
   - 比較快照，特別關注物件數量增長

### 方法 3：使用 Performance 監控

1. 切換到 Performance 標籤
2. 點擊錄製按鈕
3. 多次切換顯示/隱藏元件
4. 停止錄製並分析記憶體使用曲線

## 最佳實踐建議

1. **始終處理訂閱**：
   - 使用 takeUntil 模式
   - 手動呼叫 unsubscribe()
   - 使用 Angular 的 async pipe

2. **實現 OnDestroy 介面**：為需要清理資源的元件實現此介面

3. **使用有限生命週期的操作符**：如 take()、first() 等適合於一次性操作

4. **避免全局引用**：避免在服務中存儲對元件的引用
