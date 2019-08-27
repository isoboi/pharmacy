import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TenderService} from '../../../services/tender.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Tender} from '../../../models/tender';
import {environment} from '../../../../environments/environment';
import {RestService} from '../../../services/rest.service';
import DataSource from 'devextreme/data/data_source';


@Component({
  selector: 'app-tender-description',
  templateUrl: './tender.description.component.html',
  styleUrls: ['./tender.description.component.scss']
})

export class TenderDescriptionComponent implements OnInit, OnDestroy {
  @Input()tender: Tender;
  @Output()save = new EventEmitter();
  federalDistrict;
  federalSubject;
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
  private destroy$ = new Subject();
  isNewTender = this.route.snapshot.params.id === 'new';

  private originalHospital: any;
  constructor(private tenderService: TenderService,
              private route: ActivatedRoute,
              private restService: RestService,
              private cdr: ChangeDetectorRef) {}


  ngOnInit() {
    if (this.isNewTender) {
      this.tender = new Tender();
    }
    this.hospitals = this.restService.bindData(
      environment.apiUrl + '/Hospitals',
      ['Id'],
      {Id: 'Int32'}
    );


    this.clientName = this.restService.bindData(
      environment.apiUrl + '/Hospitals',
      ['Id'],
      {Id: 'Int32'}
    );

    this.tenderService.get('/Hospitals')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.originalHospital = data;
      });

    this.tenderService.getFederalDistrict()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.federalDistrict = data;
      });
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
    this.save.emit({tender: this.tender, action});
  }

  onFieldDataChanged($event) {


    if ($event.dataField === 'HospitalINN') {
      const inn = this.originalHospital.value.find((hosp) => hosp.Id == $event.value).INN
      console.log(inn)
      this.clientName.filter(['INN', '=', inn]);
      this.clientName.load();
    }


  }
  onInitialized() {
    this.showLoadPanel = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
