import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TodoComponent } from './list/todo.component';
import { TodoRoutingModule } from 'app/entities/todo/route/todo-routing.module';

@NgModule({
  imports: [SharedModule, TodoRoutingModule],
  declarations: [TodoComponent],
})
export class TodoModule {}
