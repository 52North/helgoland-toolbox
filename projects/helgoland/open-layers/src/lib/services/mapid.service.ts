import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";

/**
 * Service to hold the corresponding map id
 */
@Injectable({
  providedIn: "root"
})
export class OlMapId {

  private id: string | undefined;

  private subject: Subject<string> = new Subject();

  /**
   * Returns the map id in an observable
   *
   * @returns Observable of the map id
   */
  public getId(): Observable<string> {
    return this.id ? of(this.id) : this.subject;
  }

  /**
   * Sets the map id
   *
   * @param id the map id
   */
  public setId(id: string) {
    this.id = id;
    this.subject.next(id);
    this.subject.complete();
  }
}
