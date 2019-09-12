import {Component, ViewChild, enableProdMode, Renderer2, OnDestroy} from '@angular/core';
import {
  DxDataGridComponent
} from 'devextreme-angular';

import {Service} from '../home/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {TenderCase} from '../../models/case.interface';
import {environment} from '../../../environments/environment';
import {takeUntil} from 'rxjs/operators';
import {CasesService} from '../../services/cases.service';
import {Subject} from 'rxjs';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-cases',
  templateUrl: 'cases.component.html',
  styleUrls: ['./cases.component.scss'],
  preserveWhitespaces: true
})

export class CasesComponent implements OnDestroy {

  @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  dataSource: DataSource;
  dataSourceSKU: DataSource;
  filterValue: number;
  apiUrl = environment.apiUrl;
  selectedTenderCaseId: any;
  removeButtonElement: any;
  destroy$ = new Subject();
  constructor(
    private service: Service,
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestService,
    private renderer: Renderer2,
    private caseService: CasesService
  ) {

    this.showFilterRow = true;
    this.showHeaderFilter = true;
    this.dataSource = this.restService.bindData(
      environment.apiUrl + '/TenderCase',
      ['Id'],
      {Id: 'Int32'});


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete()
  }

  initialized() {
    this.service.setTenderDetails(this.dataSourceSKU);
  }

  onRowDblClick(e) {
    const data: TenderCase = e.data;
    this.service.setSelectedTender(data);
    this.router.navigateByUrl(`/cases/${data.Id}`);
  }

  onSelectionChanged(e) {
    const tenderCaseId = e.selectedRowsData[0].Id;
    this.selectedTenderCaseId = tenderCaseId;
    this.renderer.addClass(this.removeButtonElement, 'disabled');
    this.caseService.canDelete(tenderCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.value) {
          this.renderer.removeClass(this.removeButtonElement, 'disabled');
        }
      });
    this.filterValue = tenderCaseId;
    this.dataSourceSKU = this.restService.bindData(
      environment.apiUrl + '/TenderCaseSKU',
      ['Id'],
      {Id: 'Int32'});
    this.dataSourceSKU.filter(['TenderCaseId', '=', tenderCaseId]);
    this.dataSourceSKU.load();

  }


  private static getOrderDay(rowData) {
    return (new Date(rowData.OrderDate)).getDay();
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this as any;
    if (target === 'headerFilter' && value === 'weekends') {
      return [[CasesComponent.getOrderDay, '=', 0], 'or', [CasesComponent.getOrderDay, '=', 6]];
    }
    return column.defaultCalculateFilterExpression.apply(this, arguments);
  }

  orderHeaderFilter(data) {
    console.log('filter..');
    data.dataSource.postProcess = (results) => {
      results.push({
        text: 'Weekends',
        value: 'weekends'
      });
      return results;
    };
  }

  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }

  onToolbarPreparing(e) {
    const toolbarItems = e.toolbarOptions.items;
    // Adds a new item
    toolbarItems.push({
      cssClass: 'remove-button',
      widget: 'dxButton',
      options: {
        icon: 'trash', onClick: this.onClick,
        disabled: false
      },
      location: 'after'
    });
  }

  onContentReady() {
    this.removeButtonElement = document.getElementsByClassName('remove-button')[0];
    this.renderer.addClass(this.removeButtonElement, 'disabled');
  }

  private onClick = () => {
    this.caseService.detele(this.selectedTenderCaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dataSource.reload();
        this.dataSourceSKU.reload();
        this.renderer.addClass(this.removeButtonElement, 'disabled');
      });
  }
}

// @NgModule({
//     imports: [
//         BrowserModule,
//         DxDataGridModule,
//         DxSelectBoxModule,
//         DxCheckBoxModule
//     ],
//     declarations: [CasesComponent],
//     bootstrap: [CasesComponent]
// })
// export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
