import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface WMSLayer {
  Name: string;
  Title: string;
  Abstract: string;
  Layer: WMSLayer[];
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

// request Capabilities only all 5 minutes
const WMS_CAPABILITIES_REQUEST_EXPIRATION = 1000 * 60 * 5;

@Injectable({
  providedIn: 'root'
})
export class WmsCapabilitiesService {

  constructor(
    private http: HttpService
  ) { }

  public getTitle(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => layer.Title));
  }

  public getAbstract(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => layer.Abstract));
  }

  public getTimeDimensionArray(layerName: string, wmsurl: string): Observable<Date[]> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      const timeDimension = layer.Dimension.find(e => e.name = 'time');
      if (timeDimension) {
        return timeDimension.values.split(',').map(e => new Date(e));
      } else {
        return [];
      }
    }));
  }

  public getLegendUrl(layerName: string, wmsurl: string): Observable<string> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      let legendUrl = '';
      layer.Style.forEach(s => s.LegendURL.forEach(l => legendUrl = l.OnlineResource));
      return legendUrl;
    }));
  }

  public getDefaultTimeDimension(layerName: string, wmsurl: string): Observable<Date> {
    return this.getLayerInfo(layerName, wmsurl).pipe(map(layer => {
      const timeDimension = layer.Dimension.find(e => e.name = 'time');
      if (timeDimension && timeDimension.default) {
        return new Date(timeDimension.default);
      } else {
        return null;
      }
    }));
  }

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

  private getCapabilities(url: string): Observable<any> {
    if (!url.endsWith('?')) { url = url + '?'; }
    return this.http.client({ expirationAtMs: new Date().getTime() + WMS_CAPABILITIES_REQUEST_EXPIRATION }).get(`${url}service=wms&version=1.3.0&request=GetCapabilities`, { responseType: 'text' })
      .pipe(map(res => new WMSCapabilities().read(res)));
  }

  private findLayerByName(name: string, layerList: WMSLayer[]): WMSLayer {
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

  private getLayerInfo(layerName, url): Observable<WMSLayer> {
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
}
