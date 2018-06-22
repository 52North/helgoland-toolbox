import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BasicAuthService {

  private basicAuthToken: string;

  constructor(
    private http: HttpClient
  ) { }

  public auth(username: string, password: string, url: string): Observable<string> {
    const token = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ 'Authorization': token });
    return this.http.get(url, { headers })
      .pipe(
        map(res => {
          this.basicAuthToken = token;
          return token;
        })
      );
  }

  public clearToken(): void {
    this.basicAuthToken = null;
  }

  public hasToken(): boolean {
    return this.basicAuthToken != null;
  }

  public getToken(): string {
    return this.basicAuthToken;
  }

}
