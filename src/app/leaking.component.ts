import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaking',
  template: `
    <div class="leak-example">
      <h2>記憶體洩漏範例</h2>
      <p>目前資料：{{ currentData }}</p>
      <p class="warning">⚠️ 此元件沒有實施取消訂閱，會導致記憶體洩漏!</p>
    </div>
  `,
  styles: [`
    .leak-example {
      border: 2px solid red;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #ffeeee;
    }
    .warning {
      color: red;
      font-weight: bold;
    }
  `]
})
export class LeakingComponent implements OnInit {
  currentData: string = '等待資料...';
  private subscription!: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // 問題點：訂閱了 Observable 但沒有在元件銷毀時取消訂閱
    this.subscription = this.dataService.getDataStream().subscribe(data => {
      this.currentData = data;
      console.log('洩漏元件收到:', data);
    });
  }

  // 缺少 ngOnDestroy 方法來清理訂閱
  // 當使用者離開此頁面時，即使元件被銷毀，訂閱仍會持續接收資料並執行回調函數
  // 這將導致記憶體洩漏，因為資料流持續存在於記憶體中
}
