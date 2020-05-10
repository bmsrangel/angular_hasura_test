import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { environment } from 'src/environments/environment';
import { UserModel } from '../shared/models/user-model';

@Injectable({
  providedIn: 'root',
})
export class HasuraService {
  url: string;
  ws: string;
  usersWatch$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {
    this.url = environment.API;
    this.ws = environment.WS;
  }

  getUsers() {
    return this.http
      .post(this.url, {
        query: `query MyQuery {
          usuarios {
            id
            username
            name
            last_name
          }
        }
    `,
      })
      .pipe(
        map((data: { data: any }) => data.data),
        map((data: { usuarios: UserModel[] }) => data.usuarios),
        map((data: UserModel[]) => data.map((user) => new UserModel(user))),
        tap(console.log)
      );
  }

  watchUsers() {
    this.usersWatch$ = webSocket(this.ws);
    this.usersWatch$.next({
      query: `subscription MySubscription {
      usuarios {
        id
        name
        username
        last_name
      }
    }
    `,
    });
    return this.usersWatch$.asObservable();
  }

  addNewUser(username: string, name: string, lastName: string) {
    let query: string = `mutation MyMutation {
      insert_usuarios(objects: {username: "${username}", name: "${name}", last_name: "${lastName}"}) {
        affected_rows
      }
    }
    `;
    return this.http.post(this.url, { query }).pipe(
      map((data: { data: any }) => data.data),
      map((data: { insert_usuarios: any }) => data.insert_usuarios),
      map((data: { affected_rows: number }) => data.affected_rows),
      tap(console.log)
    );
  }
}
