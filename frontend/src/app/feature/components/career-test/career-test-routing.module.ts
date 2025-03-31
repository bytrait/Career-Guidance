import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerTestScreenComponent } from './career-test-screen/career-test-screen.component';
import { PersonalityTestComponent } from './personality-test/personality-test.component';
import { CareerInterestTestComponent } from './career-interest-test/career-interest-test.component';
import { canDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { WorkStreamsComponent } from './work-streams/work-streams.component';

const routes: Routes = [
  {
    path: '', component: CareerTestScreenComponent,
    children: [
      {
        path: 'personalitytest', component: PersonalityTestComponent,
        canDeactivate: [canDeactivateGuard]
      },
      {
        path: 'careerintresttest', component: CareerInterestTestComponent,
      },
      {
        path: 'workstream', component: WorkStreamsComponent,
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerTestRoutingModule { }
