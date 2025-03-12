import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeakingComponent } from './leaking.component';
import { NonLeakingComponent } from './non-leaking.component';

const routes: Routes = [
  { path: 'leaking', component: LeakingComponent },
  { path: 'non-leaking', component: NonLeakingComponent },
  { path: '', redirectTo: '/leaking', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
