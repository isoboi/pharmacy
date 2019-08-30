import { Injectable } from '@angular/core';
import {Tab} from '../models/ui.models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {ActionsTender} from '../models/tender';
import data from 'devextreme/bundles/dx.all';
import {map} from 'rxjs/operators';

const tabs: Tab[] = [
  {
    id: 0,
    text: 'Tender description',
  },
  {
    id: 1,
    text: 'Tender SKU',
    disabled: false
  },
  {
    id: 2,
    text: 'Tender Case',
    disabled: false
  }
];
const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class TenderService {

  private actions = ActionsTender;
  constructor(private http: HttpClient) { }

  getTabs(): Tab[] {
    return tabs;
  }

  getTender(id) {
    return this.http.get(apiUrl + `/Tender/${id}`);
  }

  getFederalDistrict() {
    return this.http.get(apiUrl + '/FederalDistrict');
  }

  getFederalSubject() {
    return this.http.get(apiUrl +  '/FederalSubject');
  }

  getHospitals() {
    return this.http.get(apiUrl +  '/Hospitals');
  }

  getFederalLaw() {
    return this.http.get(apiUrl +  '/FederalLaw');
  }
  getDistributor() {
    return this.http.get(apiUrl +  '/Distributor');
  }

  get(url: string) {
    return this.http.get(apiUrl + url);
  }

  save(obj, action, id) {
    if (action === this.actions.decline) {
      return this.http.get(apiUrl + `/TenderCase/BusinessServicePatch.Decline(key=${id})`);
    }
    if (action === this.actions.planned) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.ToPlanned(key=${id})`);
    }
    if (action === this.actions.announced) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.ToAnnounced(key=${id})`);
    }

    if (id === 'new') {
      return this.http.post(apiUrl + '/Tender', obj);
    }
    return this.http.patch(apiUrl + `/Tender/${id}`, obj);
  }

  detele(tenderId) {
    return this.http.delete(apiUrl + `/Tender/${tenderId}`);
  }
  canCreate() {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanCreate`);
  }

  canCreateCase() {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanCreate`);
  }

  canUpdate(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanUpdate(entityId=${id})`);
  }
  canDelete(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanDelete(entityId=${id})`)
      .pipe(map((x: any) => {
        x.value = true
        return x;
    }));
  }
  canDecline(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.Decline(key=${id})`);
  }

}
