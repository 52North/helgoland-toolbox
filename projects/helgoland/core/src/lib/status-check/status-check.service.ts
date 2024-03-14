import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Observer } from 'rxjs';

/**
 * This class checks URLs if they are reachable by a simple get request. If they gets anything back, everything is ok, otherwise
 * the corresponding method gives back the URLs which are not reachable.
 */
@Injectable()
export class StatusCheckService {
  private urls: string[] = [];

  constructor(private httpClient: HttpClient) {}

  /**
   * Checks all internal registered URLs if they are reachable. Gives back every URL, which was not reachable
   */
  public checkAll(): Observable<(string | null)[]> {
    return this.doCheck(this.urls);
  }

  /**
   * Checks the given URL.
   * @returns Observable with the URL if not reachable.
   */
  public checkUrl(url: string): Observable<string | null> {
    return this.doCheckUrl(url);
  }

  /**
   * Checks the given URLs.
   * @returns Observable of all not reachable URLs.
   */
  public checkUrls(urls: string[]): Observable<(string | null)[]> {
    return this.doCheck(urls);
  }

  /**
   * Adds the URL to the internal collection.
   */
  public addUrl(url: string) {
    const index = this.urls.indexOf(url);
    if (index === -1) {
      this.urls.push(url);
    }
  }

  /**
   * Removes the URL of the internal collection.
   */
  public removeUrl(url: string) {
    const index = this.urls.indexOf(url);
    if (index > -1) {
      this.urls.splice(index, 1);
    }
  }

  private doCheckUrl(url: string): Observable<string | null> {
    return new Observable((observer: Observer<string | null>) => {
      this.httpClient.get(url).subscribe({
        next: (res) => {
          observer.next(null);
          observer.complete();
        },
        error: (error) => {
          observer.next(url);
          observer.complete();
        },
      });
    });
  }

  private doCheck(urls: string[]): Observable<(string | null)[]> {
    const requests: Array<Observable<string | null>> = [];
    urls.forEach((url) => requests.push(this.doCheckUrl(url)));
    return forkJoin(requests);
  }
}
