import {Component, ViewChild, enableProdMode, OnInit, Renderer2, OnDestroy} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import { Service} from './app.service';
import {Router} from '@angular/router';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import {RestService} from 'src/app/services/rest.service';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {TenderService} from '../../services/tender.service';
import {takeUntil} from 'rxjs/operators';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  preserveWhitespaces: true
})

export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private service: Service,
    private tenderService: TenderService,
    private router: Router,
    private restService: RestService,
    private renderer: Renderer2
  ) {
    this.showFilterRow = true;
    this.showHeaderFilter = true;

    this.dataSource = this.restService.bindData(
      environment.apiUrl + '/Tender',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  @ViewChild(DxDataGridComponent, {static: false}) dataGrid: DxDataGridComponent;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  dataSource: DataSource;
  dataSourceSKU: DataSource;
  selectedTenderId: number;
  canCreate$: Observable<any>;
  private removeButtonElement;
  private destroy$ = new Subject();
  ngOnInit() {
    this.canCreate$ = this.tenderService.canCreate();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initialized() {
    this.service.setTenderDetails(this.dataSourceSKU);
  }

  onRowDblClick(e) {
    this.service.setSelectedTender(e.data);
    this.router.navigateByUrl(`/tender/${e.data.Id}`);
  }

  onSelectionChanged(e) {
    const tenderId = e.selectedRowsData[0].Id;
    this.renderer.addClass(this.removeButtonElement, 'disabled');
    this.tenderService.canDelete(tenderId)
      .subscribe((data: any) => {
        if (data && data.value) {
          this.renderer.removeClass(this.removeButtonElement, 'disabled');
        }
      });
    this.selectedTenderId = tenderId;
    if (!this.dataSourceSKU) {
      this.dataSourceSKU = this.restService.bindData(
        environment.apiUrl + '/TenderSKU',
        ['Id'],
        {Id: 'Int32'}
      );
    }
    this.dataSourceSKU.filter(['TenderId', '=', tenderId]);
    this.dataSourceSKU.load();
  }
  onInitNewRow() {
    this.router.navigate(['/tender/new']);
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
    this.tenderService.detele(this.selectedTenderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dataSource.reload();
        this.dataSourceSKU.reload();
        this.renderer.addClass(this.removeButtonElement, 'disabled');
      });
  }

  orderHeaderFilter(data) {
    data.dataSource.postProcess = (results) => {
      results.push({
        text: 'Weekends',
        value: 'weekends'
      });
      return results;
    };
  }
}
