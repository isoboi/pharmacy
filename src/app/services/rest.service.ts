import {Injectable} from '@angular/core';
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';

export const version = 4;

@Injectable({
  providedIn: 'root'
})

export class RestService {
  bindData(url: string, key: string[], keyType: any, params: any = {}) {
    return new DataSource({
      store: new ODataStore({
        url,
        key,
        keyType,
        version,
        errorHandler: (data) => {
          if (data && data.httpStatus) {
            if (data.httpStatus === 403) {
              notify({message: 'Permission Denied', position: 'top'}, 'error', 1500);
            } else {
              notify({message: 'Error', position: 'top'}, 'error', 1500);
            }
          }

        },
        onModified: (data) => {
          notify({message: 'Successful', position: 'top'}, 'success', 1500);
        }
      }),
      ...params
    });
  }
}
