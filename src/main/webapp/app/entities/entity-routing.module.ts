import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'todo',
        data: { pageTitle: 'todolistApp.todo.home.title' },
        loadChildren: () => import('./todo/todo.module').then(m => m.TodoModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'todolistApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'todolistApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
