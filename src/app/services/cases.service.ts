import {Tab} from '../models/ui.models';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TenderCase} from '../models/case.interface';


const tabs: Tab[] = [
  {
    id: 0,
    text: 'Case Description',
  },
  {
    id: 1,
    text: 'Case SKU',
  },
  {
    id: 2,
    text: 'Approval history',
  }
];


const apiUrl = 'http://navpharm365app.ncdev.ru/odata/';

@Injectable({
  providedIn: 'root'
})

export class CasesService {

  constructor(private http: HttpClient) {
  }

  static getTabs(): Tab[] {
    return tabs;
  }

  getDetail() {
    return forkJoin([this.getRelatedCaseComment(), this.getDistributor(), this.getChannel()]);
  }

  getRelatedCaseComment() {
    return this.http.get(apiUrl + 'RelatedCaseComment');
  }
  getDistributor() {
    return this.http.get(apiUrl + 'Distributor');
  }
  getChannel() {
    return this.http.get(apiUrl + 'Channel');
  }

  getTenderCase(id) {
    return this.http.get(apiUrl + `TenderCase/${id}`)
      .pipe(map((tenders: any) => tenders.value.find((val) => String(val.Id) === id)));
  }

  patchTenderCase(tenderCase: TenderCase) {
    return this.http.patch(apiUrl + `TenderCase`, tenderCase);
  }

  addFileData(data): Observable<any> {
    return this.http.post(apiUrl + 'Annotation/AddData', data);
  }

  fileDownload(data) {
    return this.http.post(apiUrl + 'Annotation/Download', data);
  }

  fileDelete(data) {
    return this.http.post(apiUrl + 'Annotation/Delete', data);
  }

  addApproverComment(data) {
    return this.http.post(apiUrl + 'ApproverComment/Post', data);
  }

  /********************************************************************************************************
  * Case SKU
   *********************************************************************************************************/

  getCaseSku() {
    return this.http.get(apiUrl + `TenderCaseSKU`);
  }

}
