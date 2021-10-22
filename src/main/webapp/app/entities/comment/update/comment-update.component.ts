import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IComment, Comment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { ITodo } from 'app/entities/todo/todo.model';
import { TodoService } from 'app/entities/todo/service/todo.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;

  todosSharedCollection: ITodo[] = [];

  editForm = this.fb.group({
    id: [],
    body: [null, [Validators.required]],
    createdAt: [null, [Validators.required]],
    todo: [],
  });

  constructor(
    protected commentService: CommentService,
    protected todoService: TodoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      if (comment.id === undefined) {
        const today = dayjs().startOf('day');
        comment.createdAt = today;
      }

      this.updateForm(comment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  trackTodoById(index: number, item: ITodo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(comment: IComment): void {
    this.editForm.patchValue({
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt ? comment.createdAt.format(DATE_TIME_FORMAT) : null,
      todo: comment.todo,
    });

    this.todosSharedCollection = this.todoService.addTodoToCollectionIfMissing(this.todosSharedCollection, comment.todo);
  }

  protected loadRelationshipsOptions(): void {
    this.todoService
      .query()
      .pipe(map((res: HttpResponse<ITodo[]>) => res.body ?? []))
      .pipe(map((todos: ITodo[]) => this.todoService.addTodoToCollectionIfMissing(todos, this.editForm.get('todo')!.value)))
      .subscribe((todos: ITodo[]) => (this.todosSharedCollection = todos));
  }

  protected createFromForm(): IComment {
    return {
      ...new Comment(),
      id: this.editForm.get(['id'])!.value,
      body: this.editForm.get(['body'])!.value,
      createdAt: this.editForm.get(['createdAt'])!.value ? dayjs(this.editForm.get(['createdAt'])!.value, DATE_TIME_FORMAT) : undefined,
      todo: this.editForm.get(['todo'])!.value,
    };
  }
}
