import { LightningElement, wire, track, api } from 'lwc';
import getOrderList from'@salesforce/apex/OrderClass.getOrderList';
import getSearchOrders from '@salesforce/apex/OrderList.getSearchOrders';

export default class StepOne extends LightningElement {

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
    @track selectedRow = [];
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




    // handleResult(event) {
    //     console.log('received')
    //     console.log(JSON.stringify(event.detail))
    //     this.ordList = event.detail;
    //     console.table(this.ordList)
    // }
    // get ordList () {
    //     return this.ordList;
    // }
//  @api selectedRow() {
//     var _selectedrow =this.template.querySelector('lightning-datatable').getSelectedRows();
//     // console.table(_selectedrow);
//     return _selectedrow;
// }


}