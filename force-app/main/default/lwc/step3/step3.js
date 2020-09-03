import { LightningElement,api,track, wire } from 'lwc';
import getAgentList from '@salesforce/apex/OrderClass.getAgentList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Step3 extends LightningElement {

    @api productslistagent;
    @track _selected='Agent1';
   callNumber =1;
    @track error;

    @track Agents = [];
        @track openmodel = false;
    _orderItems2 = [];
    selectedRows =[];

    @track error;
    @track listAgent =[];

    @track columns = [{
        label: 'Product Name',
        fieldName: 'ProductName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Ordered',
        fieldName: 'QuantityReceived',
        type: 'number',
        sortable: true
    },
    {
        label: 'Location',
        fieldName: 'Location',
        type:'text',
        sortable: true
        
    },
    {
        label: 'Quantity Available',
        fieldName: 'QuantityAvailable',
        type:'number',
        sortable: true
        
    },
    {
    label: 'Delivered Quantity',
    fieldName: 'QuantityD',
    type:'number',
    editable:true
    },
    {
        label: 'Agent',
        fieldName: 'Agent',
        type:'text' 
    }
    
    ];
    
    @wire (getAgentList) 
//listlocations;
wiredAgent({
    error,
    data
}) {
    if (data) {
        console.log('data '+ JSON.stringify(data));
        this.listAgent = data;
    } else if (error) {
        this.error = error;
    }
};

handleModalAddAgent() {
            
    let selectedItems2 = this.template.querySelector('lightning-datatable').selectedRows;
    console.log('selectedrows='+selectedItems2);
 
    if  (selectedItems2.length=="") {
    const evt = new ShowToastEvent({
        title: 'Application Warning',
        message: 'SELECT AT LEAST ONE PRODUCT LINE',
        variant: 'error',
        mode: 'pester'
        
    });
    this.dispatchEvent(evt);
     }
    else  {
    this.openmodel = true; 
}
    }

closeModal() {
    this.openmodel = false
} 

     handleSaveAgent() {
            
            
        // console.log('Old Array is'+JSON.stringify(this.OrderItems) );
     //    let __selected = this._selected;
        let selectedItems = this.template.querySelector('lightning-datatable').selectedRows;
        console.log('selectedRows are'+JSON.stringify(selectedItems));
        this.callNumber =2;
        this._orderItems2 = this.updateColumnArray(this.productslistagent, selectedItems,"Agent", this._selected, "N");
         
         console.log('call '+ this.callNumber)
         console.table(this._orderItems2);

         this.selectedRows = [];

         // let ItemToArray = this._selected.split(',');
         // console.log('Array'+ItemToArray);
         // console.log(ItemToArray [0]);
         // console.log(ItemToArray.length);
        
         console.table(this._orderItems2);

         const selectedEvent = new CustomEvent('finalproductlocation', { detail: this._orderItems2 });
         this.dispatchEvent(selectedEvent);

        this.closeModal();
     }

     handleClearAgent(){
         let selectedItems1 = this.template.querySelector('lightning-datatable').selectedRows;
         console.log('selectedrows='+selectedItems1);
          if  (selectedItems1.length=="") {
                    const evt = new ShowToastEvent({
                     title: 'Application Warning',
                     message: 'SELECT AT LEAST ONE PRODUCT LINE ',
                     variant: 'warning',
                     mode: 'pester'
                     });
                 this.dispatchEvent(evt);
                 }

      else {
          this._orderItems2 = this.updateColumnArray(this._orderItems2, selectedItems1,"Agent","", "N");
          this.selectedRows = [];
          console.table(this._orderItems2); }

     }


    buildArray2(Agents) {
        console.log('locations ' +JSON.stringify(Agents)) ;   
        // console.log('name1'+locations[0].Name);
        let arrayLocation = [];
            for (let i =0; i< Agents.length; i++) {
                arrayLocation.push({
                    
                    label:  Agents[i].Name,
                    value : Agents[i].Name
                    } ) 
            }
            console.log('hello');
            console.table(arrayLocation);
            return arrayLocation;
        }
    
    get options() {
        return this.buildArray2(this.listAgent);
            console.table(this.listAgent);
    }
    
    
    get selected() {
        return this._selected.length ? this._selected : 'none';
    
    }
    
    handleChange(e) {
        var Item = e.detail.value;
        
        this._selected = Item.toString();
        console.log('itemselected'+this._selected);
    
    
         
        // console.log('Item '+Item);
    
    }
    
    get OrderItems() {
        
        return this.callNumber ==1 ? this.productslistagent: this._orderItems2;
    }
    







    /**
     * This helper function returns an array with new Data. It is called for these event actions :
     *  clear Sites, Submit Add Sites, Clear Suppliers, Save Quantities, Change Unit for the selected rows, Change Unit for the current row, , Submit Add Suppliers
     * @param {*} oldArray : the existing datatable rows 
     * @param {*} selectedRows : the selected rows concerned by the update
     * @param {*} columnName : the column name concerned by the update
     * @param {*} columnValue : the new value to insert. It can be set statically if not calculatedd else it is useful in the helper metod : calculate()
     * @param {*} isValueCalculated 
     * if isValueCalculated = N then update statically the columnName with the columnValue
        if isValueCalculated = Y then  calculate the newValue based on existing values and columnValue through the method : calculateColumnValue()
     */
    
    updateColumnArray (oldArray, selectedRows, columnName, columnValue, isValueCalculated) {
        console.log('update');
        //define the columns of the datatable
        const columnName1 = "Id";
        const columnName2 = "ProductName";
        const columnName3 = "QuantityReceived";
        const columnName4 = "Location";
        const columnName5 = "QuantityAvailable";
        const columnName6 = "QuantityD";
        const columnName7 = "Agent";
       

        //define an empty array to push in it the new data products
        let newArray =[];
            //iterate for each product line
        for (let i=0; i<oldArray.length;i++){
            let currentRow = oldArray[i];  
            let currentID = currentRow.Id;
           
              // first condition if the row is not selected then copy it as it is
            //   for the undefined values put a null values ""
              if ( ! selectedRows.includes(currentID)){
 
                newArray.push({  
                    [columnName1] : currentRow[columnName1]? currentRow[columnName1] : "",
                    [columnName2] : currentRow[columnName2]? currentRow[columnName2] : "",  
                    [columnName3] : currentRow[columnName3]? currentRow[columnName3] : "",
                    [columnName4] : currentRow[columnName4]? currentRow[columnName4] : "",
                    [columnName5] : currentRow[columnName5]? currentRow[columnName5] : "",
                    [columnName6] : currentRow[columnName6]? currentRow[columnName6] : "",
                    [columnName7] : currentRow[columnName7]? currentRow[columnName7] : ""
                    
                   
                });
              } 
              // Second condition if the row is selected then update the columName with columnValue
            //   for the undefined values put a null values ""
              else {
                //Determine the final columnValue to use if it is calculated or Not
                
                let _columnValue = (isValueCalculated =="N") ? columnValue : this.calculateColumnValue(currentRow[columnName], columnValue);
               
                newArray.push({ 
                    [columnName1] : (columnName===columnName1) ? _columnValue : currentRow[columnName1] ? currentRow[columnName1] : "",
                    [columnName2] : (columnName===columnName2) ? _columnValue : currentRow[columnName2] ? currentRow[columnName2] : "",  
                    [columnName3] : (columnName===columnName3) ? _columnValue : currentRow[columnName3] ? currentRow[columnName3] : "",
                    [columnName4] : (columnName===columnName4) ? _columnValue : currentRow[columnName4] ? currentRow[columnName4] : "",
                    [columnName5] : (columnName===columnName5) ? _columnValue : currentRow[columnName5] ? currentRow[columnName5] : "",
                    [columnName6] : (columnName===columnName6) ? _columnValue : currentRow[columnName6] ? currentRow[columnName6] : "",
                    [columnName7] : (columnName===columnName7) ? _columnValue : currentRow[columnName7] ? currentRow[columnName7] : ""
                    
             
            });
        }
     }
     console.table(newArray)
        return newArray;
    }
}