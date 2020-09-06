import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private url = 'http://localhost:3000/api/user';

  private token: string;

  constructor(private http: HttpClient) { }

  getToken() { return this.token; }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post(this.url + '/signup', authData)
      .subscribe((response) => {
       console.log(response);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post<{token: string}>(this.url + '/login', authData)
      .subscribe((response) => {
        this.token = response.token;
    });
  }
}
