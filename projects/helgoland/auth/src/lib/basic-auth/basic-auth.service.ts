import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BasicAuthService {

  private basicAuthTokens: Map<string, string> = new Map();

  constructor(
    private http: HttpClient
  ) { }

  public auth(username: string, password: string, url: string): Observable<string> {
    const token = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ 'Authorization': token });
    return this.http.get(url, { headers })
      .pipe(
        map(res => {
          this.basicAuthTokens.set(url, token);
          return token;
        })
      );
  }

  public clearToken(url: string): void {
    if (this.basicAuthTokens.has(url)) {
      this.basicAuthTokens.delete(url);
    }
  }

  public hasToken(url: string): boolean {
    return this.basicAuthTokens.has(url);
  }

  public getToken(url: string): string {
    return this.basicAuthTokens.has(url) ? this.basicAuthTokens.get(url) : null;
  }

}
