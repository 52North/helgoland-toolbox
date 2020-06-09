import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface InternalWMSLayer {
  Name: string;
  Title: string;
  Abstract: string;
  Layer: InternalWMSLayer[];
  Dimension: {
    name: string;
    default: string;
    values: string;
  }[];
  BoundingBox: {
    crs: string;
    extent: number[]
  }[];
  Style: {
    Abstract: string;
    Name: string;
    Title: string;
    LegendURL: {
      Format: string;
      OnlineResource: string;
      size: number[];
    }[]
  }[];
  EX_GeographicBoundingBox: number[];
}

export interface WMSLayer {
  name: string;
  title: string;
  abstract: string;
  childLayer: WMSLayer[];
}

// request Capabilities only all 5 minutes
const WMS_CAPABILITIES_REQUEST_EXPIRATION = 1000 * 60 * 5;

/**
 * Handler for WMS capabilities
 */
@Injectable({
  providedIn: 'root'
})
export class WmsCapabilitiesService {

  constructor(
    private http: HttpService
  ) { }

  /**
   * Returns the layer title of the capabilities as observable
   *
   * @param layerName
   * @param wmsurl
   * @returns layer title as string observable
   */
  public getTitle(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => layer.Title));
  }

  /**
   * Returns the layer abstract of the capabilities as observable
   *
   * @param layerName
   * @param wmsurl
   * @returns layer abstract as string observable
   */
  public getAbstract(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => layer.Abstract));
  }

  /**
   * Returns a date array as observable for the given layername, if available
   *
   * @param layerName
   * @param wmsurl
   * @returns
   */
  public getTimeDimensionArray(layerName: string, wmsurl: string): Observable<Date[]> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      const timeDimension = layer.Dimension.find(e => e.name = 'time');
      if (timeDimension) {
        return this.createTimeList(timeDimension);
      } else {
        return [];
      }
    }));
  }

  /**
   * Returns a legend url as observable, if available
   *
   * @param layerName
   * @param wmsurl
   * @returns
   */
  public getLegendUrl(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      let legendUrl = '';
      layer.Style.forEach(s => s.LegendURL.forEach(l => legendUrl = l.OnlineResource));
      return legendUrl;
    }));
  }

  /**
   * Returns the default date as observable for the given layername, if available
   *
   * @param layerName
   * @param wmsurl
   * @returns
   */
  public getDefaultTimeDimension(layerName: string, wmsurl: string): Observable<Date> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      const timeDimension = layer.Dimension.find(e => e.name = 'time');
      if (timeDimension && timeDimension.default) {
        if (timeDimension.default === 'current') {
          const timeList = this.createTimeList(timeDimension);
          return this.findNearestTimestamp(timeList, new Date());
        } else {
          return new Date(timeDimension.default);
        }
      } else {
        return null;
      }
    }));
  }

  /**
   * Returns the extent as observable for the given layername and epsg code, if available
   *
   * @param layerName
   * @param wmsurl
   * @param epsgCode
   * @returns
   */
  public getExtent(layerName: string, wmsurl: string, epsgCode: string): Observable<{ crs: string, extent: number[] }> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      const match = layer.BoundingBox.find(e => e.crs === epsgCode);
      if (match) {
        return this.fixExtent(match.crs, match.extent);
      } else {
        if (layer.BoundingBox.length > 0) {
          return this.fixExtent(layer.BoundingBox[0].crs, layer.BoundingBox[0].extent);
        }
      }
    }));
  }

  public getLayerTree(wmsurl: string): Observable<WMSLayer> {
    return this.getCapabilities(wmsurl).pipe(map(res => this.createLayer(res.Capability.Layer)));
  }

  /**
   * Removes every request parameter of the url an returns this cleand url.
   */
  public cleanUpWMSUrl(url: string): string {
    let wmsRequesturl = url;
    if (wmsRequesturl.indexOf('?') !== -1) {
      wmsRequesturl = wmsRequesturl.substring(0, wmsRequesturl.indexOf('?'));
    }
    return wmsRequesturl;
  }

  private createLayer(layer: InternalWMSLayer): WMSLayer {
    return {
      name: layer.Name,
      title: layer.Title,
      abstract: layer.Abstract,
      childLayer: layer.Layer ? layer.Layer.map(l => this.createLayer(l)) : []
    };
  }

  private getCapabilities(url: string): Observable<any> {
    const wmsRequesturl = this.cleanUpWMSUrl(url) + '?request=GetCapabilities&service=wms&version=1.3.0';
    return this.http.client({ expirationAtMs: new Date().getTime() + WMS_CAPABILITIES_REQUEST_EXPIRATION }).get(wmsRequesturl, { responseType: 'text' })
      .pipe(map(res => new WMSCapabilities().read(res)));
  }

  private findLayerByName(name: string, layerList: InternalWMSLayer[]): InternalWMSLayer {
    let layer = layerList.find(e => e.Name === name);
    if (layer) {
      return layer;
    } else {
      for (let i = 0; i < layerList.length; i++) {
        if (layerList[i].Layer) {
          layer = this.findLayerByName(name, layerList[i].Layer);
          if (layer) {
            return layer;
          }
        }
      }
    }
  }

  private getLayerInfo(layerName, url): Observable<InternalWMSLayer> {
    return this.getCapabilities(url).pipe(
      map(caps => this.findLayerByName(layerName, caps.Capability.Layer.Layer))
    );
  }

  private fixExtent(crs: string, extent: number[]): { crs: string, extent: number[] } {
    if (crs === 'EPSG:4326') {
      const fixExtent = [extent[1], extent[0], extent[3], extent[2]];
      return { crs, extent: fixExtent };
    } else {
      return { crs, extent };
    }
  }

  private createTimeList(timeDimension: { name: string; default: string; values: string; }): Date[] {
    return timeDimension.values.split(',').map(e => new Date(e));
  }

  private findNearestTimestamp(timeList: Date[], stamp: Date): Date {
    let bestDate = timeList.length;
    let bestDiff = -(new Date(0, 0, 0)).valueOf();
    let currDiff = 0;
    for (let i = 0; i < timeList.length; ++i) {
      currDiff = Math.abs(timeList[i].valueOf() - stamp.valueOf());
      if (currDiff < bestDiff) {
        bestDate = i;
        bestDiff = currDiff;
      }
    }
    return timeList[bestDate];
  }
}
