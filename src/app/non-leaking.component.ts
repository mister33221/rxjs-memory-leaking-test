import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-non-leaking',
  template: `
    <div class="safe-example">
      <h2>無記憶體洩漏範例</h2>
      <p>目前資料：{{ currentData }}</p>
      <p class="success">✓ 此元件正確實施了取消訂閱，防止記憶體洩漏!</p>
    </div>
  `,
  styles: [`
    .safe-example {
      border: 2px solid green;
      padding: 15px;
      margin-bottom: 10px;
      background-color: #eeffee;
    }
    .success {
      color: green;
      font-weight: bold;
    }
  `]
})
export class NonLeakingComponent implements OnInit, OnDestroy {
  currentData: string = '等待資料...';
  // 使用 Subject 來管理取消訂閱
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // 使用 takeUntil 操作符，當 destroy$ 發出值時自動取消訂閱
    this.dataService.getDataStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.currentData = data;
        console.log('安全元件收到:', data);
      });
  }

  // 實現 OnDestroy 生命週期鉤子，在元件被銷毀時執行清理
  ngOnDestroy(): void {
    // 發出信號給所有使用 takeUntil(this.destroy$) 的訂閱，通知它們取消訂閱
    this.destroy$.next();
    this.destroy$.complete();
    console.log('非洩漏元件已正確清理所有訂閱');
  }
}
