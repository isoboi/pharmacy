import {Tab} from '../models/ui.models';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Actions, TenderCase} from '../models/case.interface';
import {environment} from '../../environments/environment.prod';



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


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class CasesService {
  private actions = Actions;
  constructor(private http: HttpClient) {
  }

  static getTabs(): Tab[] {
    return tabs;
  }

  getDetail() {
    return forkJoin([this.getRelatedCaseComment(), this.getDistributor(), this.getChannel()]);
  }

  getRelatedCaseComment() {
    return this.http.get(apiUrl + '/RelatedCaseComment');
  }
  getDistributor() {
    return this.http.get(apiUrl + '/Distributor');
  }
  getChannel() {
    return this.http.get(apiUrl + '/Channel');
  }

  getTenderCase(id) {
    return this.http.get(apiUrl + `/TenderCase/${id}`);
  }

  patchTenderCase(obj, action, id) {
    if (action === this.actions.reject) {
      obj.TenderCaseStatusId = 11;
    }
    return this.http.patch(apiUrl + `/TenderCase/${id}`, obj);
  }

  approversRequests(tenderCase) {
    return this.http.patch(apiUrl + `/TenderCase`, tenderCase);
  }

  rejectTenderCase(tenderCase: TenderCase) {
    tenderCase.TenderCaseStatusId = 11;
    return this.http.patch(apiUrl + `/TenderCase`, tenderCase);
  }

  addFileData(data): Observable<any> {
    return this.http.post(apiUrl + '/Annotation/AddData', data);
  }

  fileDownload(data) {
    return this.http.get(apiUrl + '/Annotation/Download', data);
  }

  fileDelete(id) {
    return this.http.delete(apiUrl + '/Annotation', id);
  }

  addApproverComment(data) {
    return this.http.post(apiUrl + '/ApproverComment/Post', data);
  }

  /********************************************************************************************************
  * Case SKU
   *********************************************************************************************************/

  getCaseSku() {
    return this.http.get(apiUrl + `/TenderCaseSKU`);
  }

}
