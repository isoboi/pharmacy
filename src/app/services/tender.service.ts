import { Injectable } from '@angular/core';
import {Tab} from '../models/ui.models';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

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
const apiUrl = 'http://navpharm365app.ncdev.ru/odata/';
@Injectable({
  providedIn: 'root'
})
export class TenderService {

  constructor(private http: HttpClient) { }

  getTabs(): Tab[] {
    return tabs;
  }

  getTender(id) {
    return this.http.get(apiUrl + `Tender/${id}`)
  }

  getFederalDistrict() {
    return this.http.get(apiUrl + 'FederalDistrict');
  }

  getFederalSubject() {
    return this.http.get(apiUrl +  'FederalSubject');
  }

  getHospitals() {
    return this.http.get(apiUrl +  'Hospitals');
  }

  getFederalLaw() {
    return this.http.get(apiUrl +  'FederalLaw');
  }
  getDistributor() {
    return this.http.get(apiUrl +  'Distributor');
  }

  get(url: string) {
    return this.http.get(apiUrl + url);
  }
}
