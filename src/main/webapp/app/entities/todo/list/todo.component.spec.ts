import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TodoService } from '../service/todo.service';

import { TodoComponent } from './todo.component';

describe('Todo Management Component', () => {
  let comp: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TodoComponent],
    })
      .overrideTemplate(TodoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TodoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.todos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
