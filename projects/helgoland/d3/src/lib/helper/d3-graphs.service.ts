import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { D3TimeseriesGraphInterface } from './../d3-timeseries-graph/d3-timeseries-graph.interface';

/**
 * Service which holds all generated graphs and their ids
 */
@Injectable({
  providedIn: 'root',
})
export class D3Graphs {
  private graphs: { [key: string]: any } = {};

  /**
   * Saves id and corresponding graph
   *
   * @param graphId
   * @param graphComp
   */
  public setGraph(graphId: string, graphComp: D3TimeseriesGraphInterface) {
    if (this.graphs[graphId] instanceof Subject) {
      const subject = this.graphs[
        graphId
      ] as Subject<D3TimeseriesGraphInterface>;
      subject.next(graphComp);
      subject.complete();
    }
    this.graphs[graphId] = graphComp;
  }

  /**
   * Delivers the corresponding graph as observable to the id
   *
   * @param graphId
   * @returns the graph as observable
   */
  public getGraph(graphId: string): Observable<D3TimeseriesGraphInterface> {
    if (this.graphs[graphId]) {
      if (this.graphs[graphId] instanceof Subject) {
        return this.graphs[graphId];
      } else {
        return of(this.graphs[graphId]);
      }
    } else {
      this.graphs[graphId] = new Subject<D3TimeseriesGraphInterface>();
      return this.graphs[graphId];
    }
  }

  /**
   * Removes the graph to the given graph id
   *
   * @param id
   */
  public removeGraph(id: string): void {
    if (this.graphs[id]) {
      delete this.graphs[id];
    }
  }
}
