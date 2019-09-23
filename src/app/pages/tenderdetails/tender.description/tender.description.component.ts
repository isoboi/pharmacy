import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TenderService} from '../../../services/tender.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ActionsTender, Tender} from '../../../models/tender';
import {environment} from '../../../../environments/environment';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';
import * as overlay from 'devextreme/ui/overlay';

overlay.baseZIndex(99999);

@Component({
  selector: 'app-tender-description',
  templateUrl: './tender.description.component.html',
  styleUrls: ['./tender.description.component.scss']
})

export class TenderDescriptionComponent implements OnInit, OnDestroy {
  @Input() tender: Tender;
  @Input() disableCreate = false;
  @Output() save = new EventEmitter();
  federalDistrict;
  fdDataSource: DataSource;
  regionDataSource: DataSource;
  hospitals: DataSource;
  federalLaw: DataSource;
  indication: DataSource;
  tenderStatus: DataSource;
  tenderStatusComment: DataSource;
  distributor: DataSource;
  contractStatus: DataSource;
  contractStatusComment: DataSource;
  showLoadPanel = true;
  sourceOfFinancing: DataSource;
  clientName: DataSource;
  legalEntityType: DataSource;
  tenderWinner: DataSource;
  showPopup = false;
  popUpValue: number;
  canUpdate$;
  id;
  private destroy$ = new Subject();
  isNewTender = this.route.snapshot.params.id === 'new';
  constructor(private tenderService: TenderService,
              private route: ActivatedRoute,
              private restService: RestService,
              private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.id = this.route.snapshot.params.id;


    if (this.isNewTender) {
      this.tender = new Tender();
      this.tender.Artificial = false;
    } else {
      this.canUpdate$ = this.tenderService.canUpdate(this.id);
    }
    this._getData();

  }

  saveTender(action) {
    if (action === ActionsTender.decline) {
      this.showPopup = true;
    } else {
      this.save.emit({tender: this.tender, action});
    }
  }

  public onInnChanged = ($event) => {
    if ($event && $event.value) {
      this.tender.LegalEntityTypeId = null;
      this.tender.ClientId = null;
      const hospital = $event.component._dataSource._items.find((hosp) => hosp.Id == $event.value);
      this.clientName.filter(['INN', '=', hospital.INN]);
      this.clientName.load();
    }
  };

  public onClientChanged = ($event) => {
    if ($event && $event.value) {
      const LegalEntityTypeId = $event.component._dataSource._items.find((hosp) => hosp.Id == $event.value).LegalEntityTypeId;
      this.tender.LegalEntityTypeId = LegalEntityTypeId;
      this.legalEntityType.filter(['Id', '=', LegalEntityTypeId]);
      this.legalEntityType.load();
    }
  };

  public fdChanged = ($event) => {
    if (this.tender) {
      this.tender.RegionId = null;
    }
    this.regionDataSource.filter(['FederalDistrictId', '=', $event.value]);
    this.regionDataSource.load();
  };

  onInitialized() {
    this.showLoadPanel = false;
    this.tender.ClientId = this.tender.HospitalId;
    this.cdr.detectChanges();
  }

  onPopUpValueChanged($event) {
    this.popUpValue = $event.value;
  }

  onOk() {
    const tender = new Tender();
    tender.TenderStatusCommentId = this.popUpValue;
    this.tenderService.save(tender, '', this.tender.Id)
      .subscribe((x) => {
        this.showPopup = false;
        this.tender.TenderStatusCommentId = this.popUpValue;
        this.popUpValue = null;
        this.save.emit({tender: this.tender, action: ActionsTender.decline});
      });
  }

  private _getData() {
    this.hospitals = this.restService.bindData(
      environment.apiUrl + '/Hospitals',
      ['Id'],
      {Id: 'Int32'}
    );
    this.clientName = this.restService.bindData(
      environment.apiUrl + '/Hospitals',
      ['Id'],
      {Id: 'Int32'});

    this.legalEntityType = this.restService.bindData(
      environment.apiUrl + '/LegalEntityType',
      ['Id'],
      {Id: 'Int32'}
    );

    this.tenderWinner = this.restService.bindData(
      environment.apiUrl + '/TenderWinner',
      ['Id'],
      {Id: 'Int32'}
    );
    this.fdDataSource = this.restService.bindData(
      environment.apiUrl + '/FederalDistrict',
      ['Id'],
      {Id: 'Int32'}
    );

    this.regionDataSource = this.restService.bindData(
      environment.apiUrl + '/FederalSubject',
      ['Id'],
      {Id: 'Int32'}
    );


    this.federalLaw = this.restService.bindData(
      environment.apiUrl + '/FederalLaw',
      ['Id'],
      {Id: 'Int32'}
    );
    this.sourceOfFinancing = this.restService.bindData(
      environment.apiUrl + '/SourceOfFinancing',
      ['Id'],
      {Id: 'Int32'}
    );
    this.tenderStatus = this.restService.bindData(
      environment.apiUrl + '/TenderStatus',
      ['Id'],
      {Id: 'Int32'}
    );

    this.tenderStatusComment = this.restService.bindData(
      environment.apiUrl + '/TenderStatusComment',
      ['Id'],
      {Id: 'Int32'}
    );

    this.indication = this.restService.bindData(
      environment.apiUrl + '/Indication',
      ['Id'],
      {Id: 'Int32'}
    );
    this.distributor = this.restService.bindData(
      environment.apiUrl + '/Distributor',
      ['Id'],
      {Id: 'Int32'}
    );

    this.contractStatus = this.restService.bindData(
      environment.apiUrl + '/ContractStatus',
      ['Id'],
      {Id: 'Int32'}
    );
    this.contractStatusComment = this.restService.bindData(
      environment.apiUrl + '/ContractStatusComment',
      ['Id'],
      {Id: 'Int32'}
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
