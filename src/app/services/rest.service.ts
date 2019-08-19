import { Injectable } from '@angular/core';
import ODataStore from "devextreme/data/odata/store";
import DataSource from "devextreme/data/data_source";

export const VERSION = 4;

@Injectable({
  providedIn: 'root'
})

export class RestService {
  bindData(url: string, keys: string[], keyType: any) {
    return new DataSource({
        store: new ODataStore({
            url: url,
            key: keys,
            keyType: keyType,
            version: VERSION
        }),
    });
  }
}
