import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OlMapId {

  private id: string;

  private subject: Subject<string> = new Subject();

  public getId(): Observable<string> {
    return this.id ? of(this.id) : this.subject;
  }

  public setId(id: string) {
    this.id = id;
    this.subject.next(id);
    this.subject.complete();
  }
}
