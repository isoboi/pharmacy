import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridComponent,
         DxDataGridModule,
         DxSelectBoxModule,
         DxCheckBoxModule } from 'devextreme-angular';

import { Tender, Service, TenderDetails } from './app.service';
import { Router } from '@angular/router';
import 'devextreme/data/odata/store';
import { version } from 'punycode';
import ODataStore from "devextreme/data/odata/store";
import DataSource from "devextreme/data/data_source";
import { RestService } from 'src/app/services/rest.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'app-root',
    templateUrl: 'home.component.html',
    styleUrls: [ './home.component.scss' ],
    preserveWhitespaces: true
})

export class HomeComponent {
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    saleAmountHeaderFilter: any;
    applyFilterTypes: any;
    currentFilter: any;
    showFilterRow: boolean;
    showHeaderFilter: boolean;
    dataSource: DataSource;
    dataSourceSKU: DataSource;
    store: ODataStore;
    filterValue: number;

    constructor(
        private service: Service,
        private router: Router,
        private restService: RestService
    ) {
        // this.tenders = service.getTenders();
        this.showFilterRow = true;
        this.showHeaderFilter = true;

        this.dataSource = this.restService.bindData(
            'https://navpharm365app.ncdev.ru/odata/Tender',
            ['Id'],
            { Id: 'Int32' }
        );

        this.dataSourceSKU = this.restService.bindData(
            'https://navpharm365app.ncdev.ru/odata/TenderSKU',
            [ 'Id' ],
            { Id: 'Int32' }
        );
    }

    initialized() {
        this.service.setTenderDetails(this.dataSourceSKU);
    }

    cellClick(e){
        const tenderId = e.data.Id;
        const data: DataSource = e.data;
        const component = e.component,
        prevClickTime = component.lastClickTime;
        component.lastClickTime = new Date();

        if (prevClickTime && (component.lastClickTime - prevClickTime < 300)) {
            //Double click code
            console.log('double click', data);
            this.service.setSelectedTender(data);
            console.log(this.service.selectedTender);
            this.router.navigateByUrl("/tender");
        } else {
            //Single click code
            console.log("clicked", data);
            this.filterValue = tenderId;
            this.dataSourceSKU = new DataSource(this.service.getTenderDetails(tenderId));
        }
    }



    private static getOrderDay(rowData) {
        return (new Date(rowData.OrderDate)).getDay();
    }

    calculateFilterExpression(value, selectedFilterOperations, target) {
        let column = this as any;
        if(target === "headerFilter" && value === "weekends") {
            return [[HomeComponent.getOrderDay, "=", 0], "or", [HomeComponent.getOrderDay, "=", 6]];
        }
        return column.defaultCalculateFilterExpression.apply(this, arguments);
    }

    orderHeaderFilter(data) {
        console.log('filter..');
        data.dataSource.postProcess = (results) => {
            results.push({
                text: "Weekends",
                value: "weekends"
            });
            return results;
        };
    }

    clearFilter() {
        this.dataGrid.instance.clearFilter();
    }
}

// @NgModule({
//     imports: [
//         BrowserModule,
//         DxDataGridModule,
//         DxSelectBoxModule,
//         DxCheckBoxModule
//     ],
//     declarations: [HomeComponent],
//     bootstrap: [HomeComponent]
// })
// export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule);
