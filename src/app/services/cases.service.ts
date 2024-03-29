import {Tab} from '../models/ui.models';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {Actions} from '../models/case.interface';
import {environment} from '../../environments/environment.prod';
import {map} from 'rxjs/operators';
import {RestService} from './rest.service';

const tabs: Tab[] = [
  {
    id: 0,
    text: 'Case Description',
  },
  {
    id: 1,
    text: 'Case SKU',
    disabled: false
  },
  {
    id: 2,
    text: 'Approval history',
    disabled: false
  }
];


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class CasesService {
  private actions = Actions;
  constructor(private http: HttpClient,
              private restService: RestService) {
  }

  static getTabs(): Tab[] {
    return tabs;
  }


  getRelatedCaseComment() {
    return this.restService.bindData(
      environment.apiUrl + '/RelatedCaseComment',
      ['Id'],
      {Id: 'Int32'});
  }
  getDistributor() {
    return this.restService.bindData(
      environment.apiUrl + '/Distributor',
      ['Id'],
      {Id: 'Int32'});
  }
  getChannel() {
    return this.restService.bindData(
      environment.apiUrl + '/Channel',
      ['Id'],
      {Id: 'String'});
  }

  getTenderCase(id): Observable<any> {
    return this.http.get(apiUrl + `/TenderCase/${id}`);
  }

  patchTenderCase(obj, action, id): Observable<any> {
    if (action === this.actions.reject) {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.Reject(key=${id})`);
    }

    if (action === this.actions.draft) {
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

  patchCase(data) {
    return this.http.patch(apiUrl + `/TenderCase/${data.Id}`, data.caseCommentId);
  }

  createRelatedCase(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CreateRelatedCase(key=${id})`);
  }

  copyCase(tender) {
    return this.http.post(apiUrl + '/TenderCase/Copy', tender);
  }

  postComment(data) {
    return this.http.post(apiUrl + `/ApproverComment`, data);
  }

  patchComment(data) {

    return this.http.patch(apiUrl + `/TenderCaseApproved/${data.TenderCaseApprovedId}`, {RequestorComment : data.Comment});
  }

  addFileData(data): Observable<any> {
    return this.http.post(apiUrl + '/Annotation', data);
  }

  deleteFile(id): Observable<any> {
    return this.http.delete(apiUrl + '/Annotation/' + id);
  }

  downloadFile(id): Observable<any> {
    return this.http.get(apiUrl + '/Annotation/Download?id=' + id);
  }
  /********************************************************************************************************
  * Case SKU
   *********************************************************************************************************/

  getApprover(ownerId) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.GetApprover(ownerId=${ownerId})`);
  }

  canUpdate(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanUpdate(entityId=${id})`);
  }

  canCreate() {
      return this.http.get(apiUrl + `/TenderCase/BusinessService.CanCreate`);
  }

  canApprove(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanApprove(entityId=${id})`);
  }

  canReject(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanReject(entityId=${id})`);
  }

  canDelete(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanDelete(entityId=${id})`);
  }

  canCreateRelatedCase(id) {
    return this.http.get(apiUrl + `/TenderCase/BusinessService.CanCreateRelatedCase(entityId=${id})`);
  }

  detele(tenderCaseId) {
    return this.http.delete(apiUrl + `/TenderCase/${tenderCaseId}`);
  }

  canDeleteApproval(id) {
    return this.http.get(apiUrl + `/Annotation/BusinessService.CanDelete(entityId=${id})`);
  }

  canCreateApproval(id) {
    return this.http.get(apiUrl + `/Annotation/BusinessService.CanCreate(tenderCaseId=${id})`);
  }

}
