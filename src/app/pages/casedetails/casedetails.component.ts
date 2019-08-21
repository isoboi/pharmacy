import {Component, OnInit} from '@angular/core';
import {Tender, Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesService} from '../../services/cases.service';
import {ActionEvent} from '../../models/case.interface';
import {subscribe} from 'graphql';

@Component({
  selector: 'app-casedetails',
  templateUrl: './casedetails.component.html',
  styleUrls: ['./casedetails.component.scss']
})
export class CasedetailsComponent implements OnInit {
  tender: Tender;
  tabs = CasesService.getTabs();
  case: any;
  tabIndex = 0;
  tenderCase;
  channel;
  selectBoxes: any;
  tenderCaseOriginal;
  constructor(
    private service: Service,
    private casesService: CasesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.casesService.getDetail()
      .subscribe(([relatedCaseComment, distributor, channel]) => {
        this.selectBoxes = {relatedCaseComment, distributor, channel};
      });
    this.tenderCase = this.casesService.getTenderCase(this.route.snapshot.params.id)
    this.tenderCase
      .subscribe((x) => {
        this.tenderCaseOriginal = JSON.parse(JSON.stringify(x));
      });
  }

  ngOnInit() {
    this.tender = this.service.getSelectedTender();
  }


  selectTab(event) {
    this.tabIndex = event.itemIndex;
  }


  saveCase(event: ActionEvent) {
      const obj = {};
      const keys = Object.keys(event.tenderCase);
      for (const key of keys) {
        if (event.tenderCase[key] !== this.tenderCaseOriginal[key]) {
          obj[key] = event.tenderCase[key];
        }
      }

      this.casesService.patchTenderCase(obj, event.action, event.tenderCase.Id)
        .subscribe((x) => {
          console.log(x);
        });
  }

}
