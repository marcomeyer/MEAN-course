import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data-model';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private url = 'http://localhost:3000/api/user/signup';

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };

    this.http
      .post(this.url, authData)
      .subscribe((response) => {
        
    });
  }
}
