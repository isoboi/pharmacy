import { Component, OnInit, Input } from '@angular/core';
import { Tender, Service } from '../home/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenderdetails',
  templateUrl: './tenderdetails.component.html',
  styleUrls: ['./tenderdetails.component.scss']
})
export class TenderdetailsComponent implements OnInit {

  tender:Tender;
  constructor(
    private service: Service,
    private router: Router
  ) {
     
  }

  ngOnInit() {
    this.tender = this.service.getSelectedTender();
  }

}
