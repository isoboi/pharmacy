import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CasesService} from '../../services/cases.service';
import {ActionEvent, Actions, TenderCase} from '../../models/case.interface';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {custom} from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-casedetails',
  templateUrl: './casedetails.component.html',
  styleUrls: ['./casedetails.component.scss']
})
export class CasedetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  case: any;
  channel;
  tabIndex = 0;
  tabs = CasesService.getTabs();
  tenderCase: Observable<any>;
  tenderCaseOriginal = new TenderCase();
  id = this.route.snapshot.params.id;

  private action: string;
  private actions = Actions;
  private destroy$ = new Subject();

  constructor(
    private service: Service,
    private casesService: CasesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    for (let i = 1; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      tab.disabled = this.id === 'new';
    }
    if (this.id !== 'new') {
      this.route.params
        .pipe(
          takeUntil(this.destroy$),
          switchMap(param => {
            this.id = param.id;
            this.tenderCase = this.casesService.getTenderCase(param.id);
            return this.tenderCase;
          })
        )
        .subscribe((x) => {
          this.tenderCaseOriginal = JSON.parse(JSON.stringify(x));
        });
    }
  }

  showDialog() {
    const myDialog = custom({
      title: 'Confirm',
      messageHtml: '<i>The similar case  is already initiated in the system. Do you want to continue?</i>',
      buttons: [{
        text: 'Continue',
        onClick: (e) => {
          return {buttonText: true};
        }
      },
        {
          text: 'Cancel',
          onClick: (e) => {
            return {buttonText: false};
          }
        }
      ],
    });
    myDialog.show().then((dialogResult) => {
      if (dialogResult.buttonText) {
        this.patchTenderCase(null, this.actions.approve, this.id);
      }
    });
  }

  ngAfterViewInit() {

  }

  selectTab(event) {
    this.tabIndex = event.itemIndex;
  }

  saveCase(event: ActionEvent) {
    const obj: any = {};
    const keys = Object.keys(event.tenderCase);
    for (const key of keys) {
      if (event.tenderCase[key] !== this.tenderCaseOriginal[key]) {
        obj[key] = event.tenderCase[key];
        if (this.id !== 'new') {
          this.tenderCaseOriginal[key] = event.tenderCase[key];
        }
      }
    }
    this.patchTenderCase(obj, event.action, this.id);
  }

  createRelatedCase(e) {
    let newCaseId;
    this.casesService.createRelatedCase(this.id)
      .pipe(switchMap((newId: any) => {
        e.Id = newId.value;
        newCaseId = newId.value;
        return this.casesService.patchCase(e);
    })).subscribe(() => this.router.navigate(['cases', newCaseId]));
  }

  copyCase(cases: any) {
    cases.Key = +this.id;
    this.casesService.copyCase(cases)
      .subscribe(res => this.router.navigate(['cases', res]));
  }

  private patchTenderCase(obj, action, id) {
    this.action = action;
    this.casesService.patchTenderCase(obj, action, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.success);
  }

  private success = (x) => {
    if (this.action === this.actions.reject) {
      this.router.navigate(['/cases']);
      return;
    }
    if (this.action !== this.actions.save) {
      if (this.action === this.actions.approversRequests) {
        if (x) {
          if (x.value) {
            this.showDialog();
          } else {
            this.patchTenderCase(null, this.actions.approve, this.id);
          }
        }
        return;
      } else if (this.action === this.actions.reject || this.action === this.actions.draft || this.actions.approve) {
        setTimeout(() => {
          if (this.action === this.actions.approve) {
            this.router.navigate(['/cases']);
          } else {
            location.reload();
          }
        }, 1500);
        notify({message: 'Successful', position: 'top'}, 'success', 1500);
      }
    } else if (this.action === this.actions.save && this.id === 'new') {
      notify({message: 'Successful', position: 'top'}, 'success', 1500);
      setTimeout(() => {
        this.router.navigate([`/cases/${x.Id}`]);
        setTimeout(() => {
          location.reload();
        });
      }, 1500);

    }
  };

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
