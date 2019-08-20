import { Injectable } from '@angular/core';
import {Tab} from '../models/ui.models';

const tabs: Tab[] = [
  {
    id: 0,
    text: 'Tender description',
  },
  {
    id: 1,
    text: 'Tender SKU',
  },
  {
    id: 2,
    text: 'Tender Case',
  }
];

@Injectable({
  providedIn: 'root'
})
export class TenderService {

  constructor() { }

  getTabs(): Tab[] {
    return tabs;
  }
}
