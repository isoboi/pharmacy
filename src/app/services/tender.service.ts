import { Injectable } from '@angular/core';
import {Tab} from '../models/ui.models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {ActionsTender} from '../models/tender';
import {Observable} from 'rxjs';
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

  save(obj, action, id): Observable<any> {
    if (action === this.actions.decline) {
      return this.http.get(apiUrl + `/Tender/BusinessService.Decline(key=${id})`);
    }
    if (action === this.actions.planned) {
      return this.http.get(apiUrl + `/Tender/BusinessService.ToPlanned(key=${id})`);
    }
    if (action === this.actions.announced) {
      return this.http.get(apiUrl + `/Tender/BusinessService.ToAnnounced(key=${id})`);
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
    return this.http.get(apiUrl + `/Tender/BusinessService.CanDelete(entityId=${id})`);
  }
  canDecline(id) {
    return this.http.get(apiUrl + `/Tender/BusinessService.CanDecline(entityId=${id})`);
  }

  canCreateTenderSKU() {
    return this.http.get(apiUrl + `/TenderSKU/BusinessService.CanCreate()`);
  }

}
