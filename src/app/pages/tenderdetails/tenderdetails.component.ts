import { Component, OnInit } from '@angular/core';
import { Service } from '../home/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../../services/tender.service';
import {ActionsTender, ActionTenderEvent} from '../../models/tender';
import notify from 'devextreme/ui/notify';

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
  private originalTender;
  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private tenderService: TenderService
  ) {

  }

  ngOnInit() {
    this.tender = this.tenderService.getTender(this.route.snapshot.params.id);
    this.tender
      .subscribe((x) => {
        this.originalTender = x;
      });
    this.tabs = this.tenderService.getTabs();
  }

  selectTab(e) {
    this.tabIndex = e.itemIndex;
  }


  save(event: ActionTenderEvent) {
    const obj = {};
    const keys = Object.keys(event.tender);
    for (const key of keys) {
      if (event.tender[key] !== this.originalTender[key]) {
        obj[key] = event.tender[key];
        this.originalTender[key] = event.tender[key];
      }
    }
    this.tenderService.save(obj, event.action, event.tender.Id)
      .subscribe((x) => {
        if (event.action !== this.actions.save) {
          if (x && x.value) {
            notify({message: 'Successfully', position: 'top'}, 'success', 1500);
          } else if (x && !x.value) {
            notify({message: 'error', position: 'top'}, 'Error', 1500);
          }
        }
      }, () => notify({message: 'error', position: 'top'}, 'Error', 1500));
  }
}
