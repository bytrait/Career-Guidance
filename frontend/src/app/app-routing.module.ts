import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './feature/components/login/login.component';
import { LoginModule } from './feature/components/login/login.module';
import { DashboardModule } from './feature/components/dashboard/dashboard.module';
import { authGuard } from './shared/guards/auth.guard';
import { ReportsModule } from './feature/components/reports/reports.module';
import { MainModule } from './feature/components/main/main.module';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => DashboardModule, canActivate: [authGuard] },
  { path: 'student-reports', loadChildren: () => DashboardModule, canActivate: [authGuard] },
  { path: 'career-preference', loadChildren: () => DashboardModule, canActivate: [authGuard] },

  //{ path: '', loadChildren: () => MainModule },
  //{ path: "", pathMatch: "full", loadChildren: () => MainModule },

  { path: '', loadChildren: () => LoginModule },
  { path: "", pathMatch: "full", loadChildren: () => LoginModule },
  { path: "**", pathMatch: "full", loadChildren: () => LoginModule },

  //{ path: 'login', loadChildren: () => LoginModule },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
