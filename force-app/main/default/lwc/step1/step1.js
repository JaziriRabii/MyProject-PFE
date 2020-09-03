import { LightningElement,wire,track } from 'lwc';
import getOrderCustomList from'@salesforce/apex/OrderClass.getOrderCustomList';
import getSearchOrders from '@salesforce/apex/OrderList.getSearchOrders';

export default class Step1 extends LightningElement {


    @track error;
    @track ordList = [];
    @track selectedRow = [];


    @track columns = [{
        label: 'Order Number',
        fieldName: 'OrderNumber',
        type: 'Auto Number',
        sortable: true
    },
    {
        label: 'Order Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Custom Name',
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


    @wire(getOrderCustomList)
    wiredOrdersCustom({
        error,
        data
    }) {
        if (data) {
            this.ordList = data;
            console.log('this.ordList'+JSON.stringify(this.ordList))
        } else if (error) {
            this.error = error;
            console.log('error'+error)
        }
    }
    @track keycode;

    handleOrderCodeChange(event) {
        this.keycode = event.target.value;
        console.log('the value entered is' + this.keycode);
    }
    handleClickSearch() {
    
        console.log('Search Clicked')

        getSearchOrders({ orderNumber : this.keycode })
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

    handleOnSelect() {
        // console.log('selected')
        //  var selecteditem = this.template.querySelector('lightning-datatable').selectedRows;
         var selecteditemid = this.template.querySelector('lightning-datatable').getSelectedRows();
        //  console.log('val selectedRows ='+selecteditem)
         console.log('val getSelectedRows ='+JSON.stringify(selecteditemid))
        // var selecteditem = this.selectedRow;
        // console.log('selectedrows'+selecteditem)
        const selectedEvent = new CustomEvent('selectedrow', { detail: selecteditemid });
        this.dispatchEvent(selectedEvent); 
         
    }

    
}