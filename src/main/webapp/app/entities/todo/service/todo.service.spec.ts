import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITodo, Todo } from '../todo.model';

import { TodoService } from './todo.service';

describe('Todo Service', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  let expectedResult: ITodo | ITodo[] | null;

  let elemDefault = {
    id: 123,
    title: 'Buy NFT',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);

    expectedResult = null;
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(Object.assign({}, elemDefault));
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Todo', () => {});

    it('should update a Todo', () => {});

    it('should partial update a Todo', () => {});

    it('should return a list of Todo', () => {
      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([elemDefault]);
      expect(expectedResult).toContainEqual(elemDefault);
    });

    it('should delete a Todo', () => {});
  });
});
