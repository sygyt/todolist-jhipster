jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentService } from '../service/comment.service';
import { IComment, Comment } from '../comment.model';
import { ITodo } from 'app/entities/todo/todo.model';
import { TodoService } from 'app/entities/todo/service/todo.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Comment Management Update Component', () => {
  let comp: CommentUpdateComponent;
  let fixture: ComponentFixture<CommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentService: CommentService;
  let todoService: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommentUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(CommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentService = TestBed.inject(CommentService);
    todoService = TestBed.inject(TodoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Todo query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const todo: ITodo = { id: 95376 };
      comment.todo = todo;

      const todoCollection: ITodo[] = [{ id: 6510 }];
      jest.spyOn(todoService, 'query').mockReturnValue(of(new HttpResponse({ body: todoCollection })));
      const additionalTodos = [todo];
      const expectedCollection: ITodo[] = [...additionalTodos, ...todoCollection];
      jest.spyOn(todoService, 'addTodoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(todoService.query).toHaveBeenCalled();
      expect(todoService.addTodoToCollectionIfMissing).toHaveBeenCalledWith(todoCollection, ...additionalTodos);
      expect(comp.todosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const comment: IComment = { id: 456 };
      const todo: ITodo = { id: 48749 };
      comment.todo = todo;

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(comment));
      expect(comp.todosSharedCollection).toContain(todo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comment>>();
      const comment = { id: 123 };
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentService.update).toHaveBeenCalledWith(comment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comment>>();
      const comment = new Comment();
      jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentService.create).toHaveBeenCalledWith(comment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Comment>>();
      const comment = { id: 123 };
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentService.update).toHaveBeenCalledWith(comment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTodoById', () => {
      it('Should return tracked Todo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTodoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
