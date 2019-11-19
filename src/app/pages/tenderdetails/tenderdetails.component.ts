import { Component, OnDestroy, OnInit } from '@angular/core';
import { Service } from '../home/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenderService } from '../../services/tender.service';
import {ActionsTender, ActionTenderEvent, Tender} from '../../models/tender';
import notify from 'devextreme/ui/notify';
import {TenderCase} from '../../models/case.interface';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.scss']
})
export class TenderDetailsComponent implements OnInit, OnDestroy {

  tender;
  tabs;
  tabIndex = 3;
  disableCreateButton = false;
  id = this.route.snapshot.params.id;

  private actions = ActionsTender;
  private originalTender = new Tender();
  private destroy$ = new Subject();

  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private tenderService: TenderService
  ) {

  }

  ngOnInit() {
    this.tabs = this.tenderService.getTabs();
    this.disableTabs(this.id === 'new');
    if (this.id !== 'new') {

      this.route.params
        .pipe(
          takeUntil(this.destroy$),
          switchMap(param => {
            this.id = param.id;
            this.tender = this.tenderService.getTender(param.id);
            return this.tender;
          })
        )
        .subscribe((x: Tender) => {
          this.originalTender = x;
          this.disableTabs(x.TenderStatusId === 4);
        });

      this.tenderService.canUpdate(this.id)
        .subscribe((x: any) => {
          this.disableTabs(!x.value);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private disableTabs(disabled) {
    for (let i = 1; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      tab.disabled = disabled;
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
    tender.LegalEntityTypeName = null;
    tender.HospitalId = tender.ClientId;
    tender.ClientId = null;
    for (const key of keys) {
      if (tender[key] && tender[key] !== this.originalTender[key]) {
        obj[key] = tender[key];
      }
    }

    let timeoutTime = 0
    if (this.id === 'new') {
      notify({message: 'Fill in SKU mandatory fields', position: 'top'}, 'success', 3000);
      timeoutTime = 3000;
      this.disableCreateButton = true;
    }

    setTimeout(() => {
      this.tenderService.save(obj, event.action, this.id)
        .subscribe((x: any) => {
          for (const key of keys) {
            if (tender[key] && tender[key] !== this.originalTender[key]) {
              if (this.id !== 'new') {
                this.originalTender[key] = tender[key];
              }
            }
          }
          if (event.action === this.actions.save) {
            if (x && x.Id) {
              this.router.navigate([`/tender/${x.Id}`]);
            }
          }
          setTimeout(() => {
            location.reload();
          });
        });
    }, timeoutTime);

  }

  copyTender(tender: any) {
    tender.Key = +this.id;
    this.tenderService.copyTender(tender)
      .subscribe(res => this.router.navigate(['tender', res]));
  }
}
