jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TodoService } from '../service/todo.service';
import { ITodo, Todo } from '../todo.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { TodoUpdateComponent } from './todo-update.component';

describe('Todo Management Update Component', () => {
  let comp: TodoUpdateComponent;
  let fixture: ComponentFixture<TodoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todoService: TodoService;
  let userService: UserService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TodoUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TodoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todoService = TestBed.inject(TodoService);
    userService = TestBed.inject(UserService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const todo: ITodo = { id: 456 };
      const user: IUser = { id: 17941 };
      todo.user = user;

      const userCollection: IUser[] = [{ id: 41697 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tag query and add missing value', () => {
      const todo: ITodo = { id: 456 };
      const tags: ITag[] = [{ id: 21525 }];
      todo.tags = tags;

      const tagCollection: ITag[] = [{ id: 13273 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags);
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todo: ITodo = { id: 456 };
      const user: IUser = { id: 90802 };
      todo.user = user;
      const tags: ITag = { id: 98320 };
      todo.tags = [tags];

      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(todo));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tagsSharedCollection).toContain(tags);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Todo>>();
      const todo = { id: 123 };
      jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(todoService.update).toHaveBeenCalledWith(todo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Todo>>();
      const todo = new Todo();
      jest.spyOn(todoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todo }));
      saveSubject.complete();

      // THEN
      expect(todoService.create).toHaveBeenCalledWith(todo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Todo>>();
      const todo = { id: 123 };
      jest.spyOn(todoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todoService.update).toHaveBeenCalledWith(todo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTagById', () => {
      it('Should return tracked Tag primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTagById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedTag', () => {
      it('Should return option if no Tag is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedTag(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Tag for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedTag(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Tag is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedTag(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
