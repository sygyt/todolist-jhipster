import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TodoComponent } from '../list/todo.component';

const todoRoute: Routes = [
  {
    path: '',
    component: TodoComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(todoRoute)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
