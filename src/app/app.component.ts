import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: [`./app.component.css`]
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
