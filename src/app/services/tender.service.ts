import { Injectable } from '@angular/core';
import {Tab} from '../models/ui.models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {ActionsTender} from '../models/tender';

const tabs: Tab[] = [
  {
    id: 0,
    text: 'Tender description',
  },
  {
    id: 1,
    text: 'Tender SKU',
  },
  {
    id: 2,
    text: 'Tender Case',
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

  canCreate() {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanCreate`);
  }

  canUpdate(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanUpdate(entityId=${id})`);
  }
  canDelete(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanDelete(entityId=${id})`);
  }
  canDecline(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanDecline(entityId=${id})`);
  }

}
