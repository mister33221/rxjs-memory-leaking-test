import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memory-test',
  template: `
    <div class="memory-test">
      <h2>記憶體洩漏檢測工具</h2>

      <div class="tool-section">
        <h3>1. 瀏覽器記憶體使用</h3>
        <button (click)="checkMemoryUsage()">檢查當前記憶體使用</button>
        <div *ngIf="memoryInfo">
          <pre>{{ memoryInfo | json }}</pre>
        </div>
      </div>

      <div class="tool-section">
        <h3>2. 觀察控制台日誌</h3>
        <p>請依照以下步驟操作，並觀察瀏覽器控制台：</p>
        <ol>
          <li>顯示「洩漏範例」組件</li>
          <li>幾秒後移除該組件（點擊「清除全部」）</li>
          <li>觀察控制台 - <strong>如果繼續看到「洩漏元件收到:」的日誌輸出，代表存在記憶體洩漏</strong></li>
        </ol>
      </div>

      <div class="tool-section">
        <h3>3. Chrome 開發者工具使用指南</h3>
        <p><strong>使用Memory標籤檢測記憶體洩漏：</strong></p>
        <ol>
          <li>按F12開啟開發者工具</li>
          <li>切換到Memory標籤</li>
          <li>選擇「Heap snapshot」</li>
          <li>點擊「Take snapshot」拍攝初始快照</li>
          <li>多次切換顯示/隱藏洩漏組件</li>
          <li>再次拍攝快照</li>
          <li>比較兩次快照，特別注意EventListener和Subscription物件數量</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .memory-test {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .tool-section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    pre {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      overflow: auto;
    }
  `]
})
export class MemoryTestComponent implements OnInit {
  memoryInfo: any;

  ngOnInit() {
    console.log('記憶體測試組件已初始化');
  }

  checkMemoryUsage() {
    if ('performance' in window && 'memory' in (performance as any)) {
      this.memoryInfo = (performance as any).memory;
    } else {
      this.memoryInfo = { message: '您的瀏覽器不支援記憶體使用量檢測' };
    }
  }
}
