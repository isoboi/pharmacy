import { Component, OnInit } from '@angular/core';
import { Service } from '../home/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../../services/tender.service';
import {ActionsTender, ActionTenderEvent, Tender} from '../../models/tender';
import notify from 'devextreme/ui/notify';
import {TenderCase} from '../../models/case.interface';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.scss']
})
export class TenderDetailsComponent implements OnInit {

  tender;
  tabs;
  tabIndex = 0;
  private actions = ActionsTender;
  private originalTender = new Tender();
  id = this.route.snapshot.params.id;
  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private tenderService: TenderService
  ) {

  }

  ngOnInit() {
    this.tabs = this.tenderService.getTabs();
    for (let i = 1; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      tab.disabled = this.id === 'new';
    }
    if (this.id !== 'new') {

      this.tender = this.tenderService.getTender(this.route.snapshot.params.id);
      this.tender
        .subscribe((x) => {
          this.originalTender = x;
        });
    }
  }

  selectTab(e) {
    this.tabIndex = e.itemIndex;
  }


  save(event: ActionTenderEvent) {
    const obj: any = {};

    const keys = Object.keys(event.tender);
    const tender = Object.assign({}, event.tender);
    tender.HospitalINN = null;
    tender.LegalEntityTypeId = null;
    tender.LegalEntityTypeName = null;
    tender.HospitalId = tender.HospitalName;
    tender.HospitalName = null;
    for (const key of keys) {
      if (tender[key] && tender[key] !== this.originalTender[key]) {
        obj[key] = tender[key];
        if (this.id !== 'new') {
          this.originalTender[key] = tender[key];
        }
      }
    }

    this.tenderService.save(obj, event.action, this.id)
      .subscribe((x: any) => {
        if (event.action === this.actions.save) {
          if (x && x.Id) {
            this.router.navigate([`/tender/${x.Id}`]);
            setTimeout(() => {
              location.reload();
            });
          }
        }
      });
  }
}
