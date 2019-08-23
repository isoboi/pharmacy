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

  getTenderCase(id): Observable<any> {
    return this.http.get(apiUrl + `/TenderCase/${id}`);
  }

  patchTenderCase(obj, action, id): Observable<any> {
    if (action === this.actions.reject) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.Reject(key=${id})`);
    }

    if (action === this.actions.reject) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.ToDraftFromReject(key=${id})`);
    }

    if (action === this.actions.approversRequests) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.CheckOnCommercialPolicyAndDuplicates(key=${id})`);
    }

    if (action === this.actions.approve) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.SendForApproval(key=${id})`);
    }

    if (id === 'new') {
      return this.http.post(apiUrl + '/TenderCase', obj);
    }

    return this.http.patch(apiUrl + `/TenderCase/${id}`, obj);
  }


  addApproverComment(data) {
    return this.http.post(apiUrl + '/ApproverComment/Post', data);
  }

  addFileData(data): Observable<any> {
    return this.http.post(apiUrl + '/Annotation/AddData', data);
  }

  /********************************************************************************************************
  * Case SKU
   *********************************************************************************************************/

  getCaseSku() {
    return this.http.get(apiUrl + `/TenderCaseSKU`);
  }

}
