import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorInterceptor } from './shared/interceptor/http-interceptor.interceptor';
import { BsDropdownConfig, BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { StudentsReportComponent } from './feature/components/students-report/students-report.component';
import { FormsModule } from '@angular/forms';
import { ReportsModule } from './feature/components/reports/reports.module';
import { CareerPreferenceComponent } from './feature/components/career-preference/career-preference.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentsReportComponent,
    CareerPreferenceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReportsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorInterceptor,
    multi: true
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
