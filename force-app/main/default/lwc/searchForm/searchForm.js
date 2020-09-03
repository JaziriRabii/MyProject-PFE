import { LightningElement, track, wire } from 'lwc';
import getOrderList from'@salesforce/apex/OrderClass.getOrderList';
import getSearchOrders from '@salesforce/apex/OrderList.getSearchOrders';
export default class SearchForm extends LightningElement {

    @track columns = [{
        label: 'Order Code',
        fieldName: 'Order_Code__c',
        type: 'text',
        sortable: true
    },
    {
        label: 'Order Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Supplier Name',
        fieldName: 'AccountName__c',
        type: 'Formula',
        sortable: true
    },
    {
        label: 'Date',
        fieldName: 'EffectiveDate',
        type: 'date',
        sortable: true
        
        
    },
    {
        label: 'Price',
        fieldName: 'TotalAmount',
        type: 'currency',
        sortable: true
    }
];






    @track error;
    @track ordList = [];

    @wire(getOrderList)
    wiredOrders({
        error,
        data
    }) {
        if (data) {
            this.ordList = data;
        } else if (error) {
            this.error = error;
        }
    }

   /* @track order_Code = "";
    @track supplier_Name = "";
    @track date_Date = "";
    @track price_Price = ""; */
    @track error;
 
    @track keycode;

    handleOrderCodeChange(event) {
        this.keycode = event.target.value;
        console.log('the value entered is' + this.keycode);
    }

  /*  handleSupplierNameChange(event) {
        this.supplier_Name = event.detail.value;
    }

    handleDateChange(event) {
        this.date_Date = event.detail.value;
    }

    handlePriceChange(event) {
        this.price_Price = event.detail.value;
    } */

    handleClickSearch() {
    
        console.log('Search Clicked')

        getSearchOrders({ orderCode : this.keycode })
         .then(result => {
             console.log(result);
            this.ordList = result;
            this.error = undefined;
            
        })
        .catch(error => {
            this.error = error;
            this.ordList = undefined;
            
        });

        //  console.log(this.data);

        //  const selectedEvent = new CustomEvent('resultdata', { detail: this.resultdata }); 
        //   this.dispatchEvent(selectedEvent); 
        }
     }