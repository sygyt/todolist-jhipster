import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITodo } from 'app/entities/todo/todo.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

export type EntityResponseType = HttpResponse<ITodo>;
export type EntityArrayResponseType = HttpResponse<ITodo[]>;

@Injectable({ providedIn: 'root' })
export class TodoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITodo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITodo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}
