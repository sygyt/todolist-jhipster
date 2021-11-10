jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITodo, Todo } from '../todo.model';
import { TodoService } from '../service/todo.service';

import { TodoRoutingResolveService } from './todo-routing-resolve.service';

describe('Todo routing resolve service', () => {
  let mockRouter: Router;
  let service: TodoService;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let resultTodo: ITodo | undefined;
  let routingResolveService: TodoRoutingResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    service = TestBed.inject(TodoService);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(TodoRoutingResolveService);
    resultTodo = undefined;
  });

  describe('resolve', () => {
    it('should return ITodo returned by find', () => {
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodo = result;
      });

      expect(service.find).toBeCalledWith(123);
      expect(resultTodo).toEqual({ id: 123 });
    });

    it('should return new ITodo if id is not provided', () => {
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodo = result;
      });

      expect(service.find).not.toBeCalled();
      expect(resultTodo).toEqual(new Todo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: (null as unknown) as Todo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTodo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTodo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
