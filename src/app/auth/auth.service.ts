import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private url = 'http://localhost:3000/api/user';

  private isAuthenticated = false;

  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getToken() { return this.token; }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

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

        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
    });
  }
}
