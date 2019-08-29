import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import {RestService} from '../../../services/rest.service';
import {environment} from '../../../../environments/environment';
import {Tender} from '../../../models/tender';

@Component({
  selector: 'app-tender-case',
  templateUrl: './tender-case.component.html',
  styleUrls: ['./tender-case.component.scss']
})
export class TenderCaseComponent implements OnInit {
  @Input()tender: Tender;
  tenderCase: DataSource;
  currentFilter: any;
  id;
  apiUrl = environment.apiUrl;
  constructor(private restService: RestService,
              private route: ActivatedRoute,
              private router: Router) {
    this.id = route.snapshot.params.id;
  }

  ngOnInit() {
    this._getTenderCase();
  }

  onRowDblClick(e) {
    this.router.navigate(['/cases/', e.data.Id]);
  }

  private _getTenderCase() {
    this.tenderCase = this.restService.bindData(
      this.apiUrl + '/TenderCase',
      ['Id'],
      {Id: 'Int32'}
    );
    this.tenderCase.filter(['TenderId', '=', Number(this.id)]);
    this.tenderCase.load();
  }

}
