import {Component, OnInit} from '@angular/core';
import {Tender, Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RestService} from 'src/app/services/rest.service';
import {CasesService} from '../../services/cases.service';
import {TenderCase} from '../../models/case.interface';

@Component({
  selector: 'app-casedetails',
  templateUrl: './casedetails.component.html',
  styleUrls: ['./casedetails.component.scss']
})
export class CasedetailsComponent implements OnInit {
  tender: Tender;
  tabs = CasesService.getTabs();
  case: any;
  tabIndex = 1;
  tenderCase;
  channel;
  selectBoxes: any;
  constructor(
    private service: Service,
    private casesService: CasesService,
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestService
  ) {
    this.casesService.getDetail()
      .subscribe(([relatedCaseComment, distributor, channel]) => {
        this.selectBoxes = {relatedCaseComment, distributor, channel};
      });
    this.tenderCase = this.casesService.getTenderCase(this.route.snapshot.params.id);
  }

  ngOnInit() {
    this.tender = this.service.getSelectedTender();
  }


  selectTab(event) {
    this.tabIndex = event.itemIndex;
  }


  saveCase(event: TenderCase) {
    this.casesService.patchTenderCase(event)
      .subscribe((x) => {
        console.log(x);
      })
  }

}
