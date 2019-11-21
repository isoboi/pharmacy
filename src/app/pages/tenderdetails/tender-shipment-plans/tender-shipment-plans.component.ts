import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from '../../../../environments/environment';
import { RestService } from '../../../services/rest.service';
import { TenderService } from '../../../services/tender.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tender-shipment-plans',
  templateUrl: './tender-shipment-plans.component.html',
  styleUrls: ['./tender-shipment-plans.component.scss']
})
export class TenderShipmentPlansComponent implements OnInit, OnDestroy {

  @ViewChild('tenderSkuPlanGrid', {static: true}) tenderSkuPlanGrid: DxDataGridComponent;

  currentFilter: any;
  tenderId: any;
  tenderSkuId: any;
  periodPlan: any;
  tenderSku: DataSource;
  tenderSkuPlan: DataSource;
  tenderSKUPlanArchive: DataSource;
  tenderPlanVersion$: Observable<any>;
  period = {
    PeriodStart: null,
    PeriodEnd: null,
    TenderSKUId: null
  };

  private destroy$ = new Subject();

  constructor(
    private restService: RestService,
    private tenderService: TenderService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.tenderId = this.activatedRoute.snapshot.params.id;
    this.getTenderSku();
    this.getTenderPlanVersion();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSelectionChanged(e) {
    this.tenderSkuId = e.selectedRowsData[0].Id;
    this.period.TenderSKUId = this.tenderSkuId;
    this.getTenderSkuPlan();
    this.TenderSKUPlanArchive();
  }

  onCreateNewVersion() {
    this.tenderService.createNewVersion(this.tenderSkuId)
      .subscribe();
  }

  onCellClick(e: any) {
    if (e.column.dataField === 'Alive' && e.row) {
      const alivePeriodDate = new Date(e.row.data.PeriodDate);
      const dateNow = new Date();

      if (dateNow.getMonth() <= alivePeriodDate.getMonth() && dateNow.getFullYear() <= alivePeriodDate.getFullYear()) {
        this.tenderSkuPlanGrid.instance.editCell(e.rowIndex, e.columnIndex);
      }
    }
  }

  onTenderPlanVersion(e) {
    this.tenderSKUPlanArchive.filter(['TenderPlanVersionId', '=', e.value]);
    this.tenderSKUPlanArchive.load();
  }

  setPeriod() {
    const period = {
      PeriodStart: this.getDate(this.period.PeriodStart),
      PeriodEnd: this.getDate(this.period.PeriodEnd),
      TenderSKUId: this.period.TenderSKUId
    };
    this.tenderService.setPeriod(period)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getTenderSkuPlan();
      });
  }

  setPeriodPlan() {
    const period = {
      PeriodStart: this.getDate(this.periodPlan),
      PeriodEnd: null,
      TenderSKUId: this.period.TenderSKUId
    };
    this.tenderService.setPlanPeriod(period)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private getDate(dateValue: Date) {
    const date = new Date(dateValue);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  }

  private getTenderSku() {
    this.tenderSku = this.restService.bindData(
      environment.apiUrl + '/TenderSKU',
      ['TenderId'],
      {Id: 'Int32'}
    );
  }

  private getTenderSkuPlan() {
    if (!this.tenderSkuPlan) {
      this.tenderSkuPlan = this.restService.bindData(
        environment.apiUrl + '/TenderSKUPlan',
        ['Id'],
        {Id: 'Int32'}
      );
    }
    this.tenderSkuPlan.filter(['TenderSKUId', '=', this.tenderSkuId]);
    this.tenderSkuPlan.load();
  }

  private TenderSKUPlanArchive() {
    if (!this.tenderSKUPlanArchive) {
      this.tenderSKUPlanArchive = this.restService.bindData(
        environment.apiUrl + '/TenderSKUPlanArchive',
        ['Id'],
        {Id: 'Int32'}
      );
    }
    this.tenderSKUPlanArchive.filter(['TenderSKUId', '=', this.tenderSkuId]);
    this.tenderSKUPlanArchive.load();
  }

  private getTenderPlanVersion() {
    this.tenderPlanVersion$ = this.tenderService.getTenderPlanVersion()
      .pipe(
        takeUntil(this.destroy$),
        map((item: any) => item.value)
      );
  }
}
