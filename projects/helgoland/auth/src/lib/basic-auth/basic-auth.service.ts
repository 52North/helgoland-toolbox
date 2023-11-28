import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Maintains all basic auth tokens and also do the authentication process.
 */
@Injectable()
export class BasicAuthService {

  private basicAuthTokens: Map<string, string> = new Map();

  public ongoingRequests: Map<string, Observable<boolean>> = new Map();

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Do the authentication.
   */
  public auth(username: string, password: string, url: string): Observable<string> {
    const token = "Basic " + btoa(username + ":" + password);
    const headers = new HttpHeaders({ "Authorization": token });
    return this.http.get(url, { headers })
      .pipe(
        map(res => {
          this.basicAuthTokens.set(url, token);
          return token;
        })
      );
  }

  /**
   * Removes existing token.
   */
  public clearToken(url: string): void {
    if (this.basicAuthTokens.has(url)) {
      this.basicAuthTokens.delete(url);
    }
  }

  /**
   * Checks if a token exists.
   */
  public hasToken(url: string): boolean {
    return this.basicAuthTokens.has(url);
  }

  /**
   * Gets the token for the given service url.
   */
  public getToken(url: string): string | undefined {
    return this.basicAuthTokens.get(url);
  }

}
