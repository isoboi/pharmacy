import {
  AfterViewInit,
  OnDestroy,
  Component,
  EventEmitter,
  Output,
  ElementRef,
  Input,
  HostListener
} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements AfterViewInit, OnDestroy {
  @Output() onClose = new EventEmitter();

  @Input() styles;
  subscriptions: Subscription[] = [];

  scrollWidth: string;

  @HostListener('document:keydown.escape')
  onKeyDownHandler() {

    this.closePopup();
  }

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    document.querySelector('body').style.overflowY = 'hidden';
    this.elementRef.nativeElement.firstChild.className += ' is-shown';
    // Scrollbar staff **/
    this.scrollWidth = String(this.getScrollbarWidth()).concat('px');
    document.querySelector('body').style.paddingRight = this.scrollWidth;
    document.querySelector('header').style.paddingRight = this.scrollWidth;
    // Scrollbar staff **/
  }

  ngOnDestroy() {
    document.querySelector('body').style.overflowY = 'inherit';
    // Scrollbar staff
    document.querySelector('body').style.paddingRight = '0px';
    document.querySelector('header').style.paddingRight = '0px';
    // Scrollbar staff
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  closePopup() {
    this.onClose.emit(false);
  }

  preventDefault(event) {
    event.stopPropagation();
  }

  private getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';
    // add innerdiv
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    // remove divs
    outer.parentNode.removeChild(outer);
    return String(widthNoScroll - widthWithScroll);
  }
}
