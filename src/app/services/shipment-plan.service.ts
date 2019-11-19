import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentPlanService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getTams(): Observable<any> {
    return this.http.get<any>(this.api + '/Requestor');
  }
}
