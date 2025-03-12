import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  // 建立可觀察資料流，每秒發出一個遞增數字
  getDataStream(): Observable<string> {
    return interval(1000).pipe(
      map(count => `資料更新第 ${count} 次`)
    );
  }
}
