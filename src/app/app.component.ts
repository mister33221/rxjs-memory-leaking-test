import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Angular 記憶體洩漏示範</h1>

      <div class="controls">
        <button (click)="showLeakingExample = true; showNonLeakingExample = false">
          顯示洩漏範例
        </button>
        <button (click)="showLeakingExample = false; showNonLeakingExample = true">
          顯示無洩漏範例
        </button>
        <button (click)="showLeakingExample = false; showNonLeakingExample = false">
          清除全部
        </button>
        <button (click)="toggleComponents()" class="test-btn">
          測試：快速切換組件 (10次)
        </button>
      </div>

      <div class="status">
        <p>切換次數：{{ toggleCount }}</p>
        <p>當前記憶體用量：<span id="memory-usage">請使用開發者工具檢查</span></p>
      </div>

      <div class="components">
        <app-leaking *ngIf="showLeakingExample"></app-leaking>
        <app-non-leaking *ngIf="showNonLeakingExample"></app-non-leaking>
      </div>

      <div class="explanation">
        <h3>記憶體洩漏解釋</h3>
        <div class="explanation-box">
          <h4>洩漏範例解釋：</h4>
          <p>
            洩漏元件在創建訂閱後，沒有在元件被銷毀時（ngOnDestroy）取消訂閱。
            即使元件從 DOM 中移除，訂閱仍然存在並繼續收到資料更新。
            這將導致：
            <ul>
              <li>不必要的記憶體使用</li>
              <li>不必要的計算開銷</li>
              <li>可能的意外行為（如關閉頁面後仍然執行後台操作）</li>
              <li>隨時間累積，更多洩漏會導致應用程式變慢或崩潰</li>
            </ul>
        </div>

        <div class="explanation-box">
          <h4>無洩漏範例解釋：</h4>
          <p>
            正確實現：
            <ul>
              <li>實現了 OnDestroy 介面</li>
              <li>使用 takeUntil 操作符配合 Subject</li>
              <li>在 ngOnDestroy 中發出信號取消所有訂閱</li>
              <li>釋放資源，防止記憶體洩漏</li>
            </ul>
            此方法也可替代為：
            <ul>
              <li>直接在 ngOnDestroy 中調用 subscription.unsubscribe()</li>
              <li>使用 async pipe 在模板中（Angular 會自動處理訂閱生命週期）</li>
            </ul>
        </div>

        <div class="explanation-box">
          <h4>如何檢測記憶體洩漏：</h4>
          <ol>
            <li>
              <strong>使用Chrome開發者工具：</strong>
              <ul>
                <li>按F12打開開發者工具</li>
                <li>切換到Memory標籤</li>
                <li>點擊"Take Snapshot"拍攝記憶體快照</li>
                <li>多次切換洩漏組件後再拍攝一次快照</li>
                <li>比較快照中的物件數量增長</li>
              </ul>
            </li>
            <li>
              <strong>觀察控制台輸出：</strong>
              <ul>
                <li>清除組件後，查看控制台是否仍有"洩漏元件收到..."日誌</li>
                <li>如果組件已銷毀但仍在接收資料，說明存在記憶體洩漏</li>
              </ul>
            </li>
            <li>
              <strong>使用Performance標籤：</strong>
              <ul>
                <li>切換到Performance標籤</li>
                <li>開始記錄，執行操作，停止記錄</li>
                <li>檢查記憶體使用量隨時間變化曲線</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .controls {
      margin: 20px 0;
    }
    button {
      margin-right: 10px;
      padding: 8px 16px;
      cursor: pointer;
    }
    .components {
      margin: 20px 0;
    }
    .explanation {
      margin-top: 30px;
      border-top: 1px solid #ccc;
      padding-top: 20px;
    }
    .explanation-box {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .test-btn {
      background-color: #6200ee;
      color: white;
    }
    .status {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
  `]
})
export class AppComponent {
  showLeakingExample = false;
  showNonLeakingExample = false;
  toggleCount = 0;

  toggleComponents() {
    // 快速切換組件10次以便測試記憶體洩漏
    let count = 0;
    const interval = setInterval(() => {
      this.showLeakingExample = !this.showLeakingExample;
      this.showNonLeakingExample = !this.showNonLeakingExample;
      this.toggleCount++;
      count++;

      if (count >= 10) {
        clearInterval(interval);
      }
    }, 500);
  }
}
