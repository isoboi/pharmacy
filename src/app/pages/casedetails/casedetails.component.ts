import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesService} from '../../services/cases.service';
import {ActionEvent, Actions, TenderCase} from '../../models/case.interface';
import notify from 'devextreme/ui/notify';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-casedetails',
  templateUrl: './casedetails.component.html',
  styleUrls: ['./casedetails.component.scss']
})
export class CasedetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  tabs = CasesService.getTabs();
  case: any;
  tabIndex = 0;
  tenderCase: Observable<any>;
  channel;
  selectBoxes: any;
  tenderCaseOriginal = new TenderCase();
  id: string;
  private actions = Actions;
  private destroy$ = new Subject();
  constructor(
    private service: Service,
    private casesService: CasesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.casesService.getDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(([relatedCaseComment, distributor, channel]) => {
        this.selectBoxes = {relatedCaseComment, distributor, channel};
        console.log(this.selectBoxes);
      });
    this.id = this.route.snapshot.params.id;
    if (this.id !== 'new') {
      this.tenderCase = this.casesService.getTenderCase(this.id);
      this.tenderCase
        .pipe(takeUntil(this.destroy$))
        .subscribe((x) => {
          this.tenderCaseOriginal = JSON.parse(JSON.stringify(x));
        });
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

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
          if (this.id !== 'new') {
            this.tenderCaseOriginal[key] = event.tenderCase[key];
          }
        }
      }
      this.casesService.patchTenderCase(obj, event.action, this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((x: any) => {
          if (event.action !== this.actions.save) {
            if (x && x.value) {
              notify({message: 'Successfully', position: 'top'}, 'success', 1500);
            } else if (x && !x.value) {
              notify({message: 'error', position: 'top'}, 'Error', 1500);
            }
          }
        }, () => notify({message: 'error', position: 'top'}, 'Error', 1500));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
