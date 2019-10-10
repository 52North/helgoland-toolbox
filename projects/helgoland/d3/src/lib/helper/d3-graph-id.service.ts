import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

/**
 * Service to hold the corresponding graph id
 */
@Injectable()
export class D3GraphId {

  private id: string;

  private subject: Subject<string> = new Subject();

  /**
   * Returns the graph id in an observable
   *
   * @returns Observable of the graph id
   */
  public getId(): Observable<string> {
    return this.id ? of(this.id) : this.subject;
  }

  /**
   * Sets the graph id
   *
   * @param id the graph id
   */
  public setId(id: string) {
    this.id = id;
    this.subject.next(id);
    this.subject.complete();
  }
}
