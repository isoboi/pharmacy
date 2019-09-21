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
  federalSubject;
  regionDataSource: DataSource;
  hospitals: DataSource;
  federalLaw;
  tenderStatusComment;
  indication;
  tenderStatus;
  distributor;
  contractStatus;
  contractStatusComment;
  showLoadPanel = true;
  sourceOfFinancing;
  clientName: DataSource;
  legalEntityType: DataSource;
  tenderWinner: DataSource;
  showPopup = false;
  popUpValue: number;
  canUpdate$;
  id;
  private destroy$ = new Subject();
  isNewTender = this.route.snapshot.params.id === 'new';

  originalHospital: any;

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

    this.hospitals = this.restService.bindData(
      environment.apiUrl + '/Hospitals',
      ['Id'],
      {Id: 'Int32'}
    );
    this.hospitals.load();
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


    this.tenderService.getHospitals()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.originalHospital = data.value;
      });


    // this.tenderService.getFederalDistrict()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     this.federalDistrict = data;
    //   });
    this.tenderService.getFederalSubject()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.federalSubject = data;
      });
    this.tenderService.getFederalLaw()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.federalLaw = data;
      });

    this.tenderService.get('/TenderStatus')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.tenderStatus = data;
      });

    this.tenderService.get('/TenderStatusComment')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.tenderStatusComment = data;
      });

    this.tenderService.get('/Indication')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.indication = data;
      });


    this.tenderService.get('/Distributor')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.distributor = data;
      });

    this.tenderService.get('/ContractStatus')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.contractStatus = data;
      });

    this.tenderService.get('/ContractStatusComment')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.contractStatusComment = data;
      });

    this.tenderService.get('/SourceOfFinancing')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.value) {
          this.sourceOfFinancing = data.value;
        }
      });
  }

  saveTender(action) {
    if (action === ActionsTender.decline) {
      this.showPopup = true;
    } else {
      this.save.emit({tender: this.tender, action});
    }
  }

  onFieldDataChanged($event) {
    // if ($event.dataField === 'HospitalId' && this.originalHospital) {
    //   const hospiral = this.originalHospital.value.find((hosp) => hosp.Id == $event.value);
    //   this.clientName.filter(['INN', '=', hospiral.INN]);
    //   this.tender.LegalEntityTypeId = null;
    //   this.tender.HospitalName = hospiral.HospitalName;
    //   this.clientName.load().then((data) => {
    //     this.originalClientName = data;
    //     const LegalEntityTypeId = this.originalClientName.find((hosp) => hosp.Id == $event.value).LegalEntityTypeId;
    //     this.tender.LegalEntityTypeId = LegalEntityTypeId;
    //     this.legalEntityType.filter(['Id', '=', LegalEntityTypeId]);
    //     this.legalEntityType.load();
    //   });
    //
    //
    // }
    // if ($event.dataField === 'HospitalName' && this.originalClientName) {
    //
    // }
  }

  public onInnChanged = ($event) => {
    if ($event && $event.value) {
      this.tender.LegalEntityTypeId = null;
      this.tender.ClientId = null;
      const hospiral = this.originalHospital.find((hosp) => hosp.Id == $event.value);
      this.clientName.filter(['INN', '=', hospiral.INN]);
      this.clientName.load();
    }
  };

  public onClientChanged = ($event) => {
    if ($event && $event.value) {
      const LegalEntityTypeId = this.originalHospital.find((hosp) => hosp.Id == $event.value).LegalEntityTypeId;
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
  }

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
