import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {TenderService} from '../../../services/tender.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Tender} from '../../../models/tender';


@Component({
  selector: 'app-tender-description',
  templateUrl: './tender.description.component.html',
  styleUrls: ['./tender.description.component.scss']
})

export class TenderDescriptionComponent implements OnChanges, OnInit, OnDestroy {
  @Input()tender: Tender;
  @Output()save = new EventEmitter();
  federalDistrict;
  federalSubject;
  hospitals;
  federalLaw;
  tenderStatusComment;
  indication;
  tenderStatus;
  distributor;
  contractStatus;
  contractStatusComment;
  showLoadPanel = true;
  private destroy$ = new Subject();
  isNewTender = this.route.snapshot.params.id === 'new';
  constructor(private tenderService: TenderService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  ngOnInit() {
    if (this.isNewTender) {
      this.tender = new Tender();
    }
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
    this.tenderService.getHospitals()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.hospitals = data;
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
  }

  saveTender(action) {
    this.save.emit({tender: this.tender, action});
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
