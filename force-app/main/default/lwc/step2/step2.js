import { LightningElement,api, track } from 'lwc';
import getNewProductsList from '@salesforce/apex/OrderClass.getNewProductsList';
export default class Step2 extends LightningElement {

    @api selectedorder = [];
    selectedRows =[];
    @track error;
    _orderItems = [];
    @track OrderItems1 = [];
  
     
     
    get OrderNumber(){
        return this.selectedorder[0].OrderNumber;
    }
    


get Custom(){
    return this.selectedorder[0].AccountName__c;
}

get Date(){
    return this.selectedorder[0].EffectiveDate;
}


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
}

];

connectedCallback() {
    console.log('connectedCallback succeded');
    console.log('rrrr'+ this.selectedorder[0].OrderNumber);
    getNewProductsList({ orderId : this.selectedorder[0].OrderNumber})
     .then(result => {
         console.log('result');
        // console.table(this.finalArray)
        this.OrderItems1 = result;
       
console.log(JSON.stringify(this.OrderItems1))
        // console.table(this.OrderDetail);
        // console.table(this.OrderDetail[0].OrderItems);
        // console.log('ryhgg'+stringify(this.OrderItems))
    
        this._orderItems = this.buildArray(this.OrderItems1[0].LocationsWorkOrdersProducts__r)
        console.log(JSON.stringify(this._orderItems))
        
        this.error = undefined;
        
    })
    .catch(error => {
        this.error = error;
        this.OrderItems1 = undefined;
        
    });
}
    
get OrderItems() {
        
    return this._orderItems;
}

// handleSaveDraftValues(event) {
//     console.log(JSON.stringify(this.steplocations))
//     //define an array that contains only the draft Values
//     let draftValues =  event.detail.draftValues;
//     console.log('draft v '+JSON.stringify(draftValues))
//     //define a new array and inialize it with the existing products in the datatable
//     let finalNewProducts = [];
//     finalNewProducts = JSON.parse(JSON.stringify(this.products));
//     console.table(finalNewProducts);
//     // iterate for all rows in draftvalues array and call updateColumnArray for each row
//     for(let i=0;i<draftValues.length; i++) {
//         //get the columnName parameter
//          let quantityValue = draftValues[i].QuantityL;
//          console.log('quantityValue'+quantityValue);

//         //  get the selectedRows parameter
//          let currentID = [];
//          currentID[0] = draftValues[i].Id;

//          console.log('curr'+currentID.length);
//         // get the new array with the column updated for the row i
//          finalNewProducts = this.updateColumnArray(finalNewProducts, currentID, "QuantityL", quantityValue, "N");
//     }
//     // console.table(finalNewProducts)

//     this.products = finalNewProducts;
//     this.draftValues =[];

//     const selectedEvent = new CustomEvent('finallistproduct', { detail: this.products});
//             this.dispatchEvent(selectedEvent);

// }

buildArray(orderItems) {
    var finalArray = [];
    for (let i =0; i< orderItems.length; i++) {
        finalArray.push({
            // ProductCode :  orderItems[i].Product2.ProductCode,
            // ProductName : orderItems[i].Product2.Name,
            // Quantity : orderItems[i].Quantity })
            Id : orderItems[i].Id,
      
            ProductName : orderItems[i].Product__r.Name,
            QuantityReceived :  orderItems[i].QuantityReceived__c,
            Location :orderItems[i].Location__r.Name,
            QuantityAvailable: orderItems[i].QuantityAvailable__c,
            QuantityD: ''
      } ) 
    }
    console.table(finalArray);
    return finalArray;
}









// buildArray2(delivredquantites) {
//     console.log('locations ' +JSON.stringify(delivredquantites)) ;   
//     // console.log('name1'+locations[0].Name);
//     let arrayLocation = [];
//         for (let i =0; i< delivredquantites.length; i++) {
//             arrayLocation.push({
                
//                 label:  delivredquantites[i].Name,
//                 value : delivredquantites[i].Name
//                 } ) 
//         }
//         console.log('hello');
//         console.table(arrayLocation);
//         return arrayLocation;
//     }


handleSaveDraftValues(event) {
    // console.log(JSON.stringify(this.steplocations))
    //define an array that contains only the draft Values
    let draftValues =  event.detail.draftValues;
    console.log('draft v '+JSON.stringify(draftValues))
    //define a new array and inialize it with the existing products in the datatable
    let finalNewProducts = [];
    finalNewProducts = JSON.parse(JSON.stringify(this._orderItems));
    console.table(finalNewProducts);
    // iterate for all rows in draftvalues array and call updateColumnArray for each row
    for(let i=0;i<draftValues.length; i++) {
        //get the columnName parameter
         let quantityValue = draftValues[i].QuantityD;
         console.log('quantityValue'+quantityValue);

        //  get the selectedRows parameter
         let currentID = [];
         currentID[0] = draftValues[i].Id;

         console.log('curr'+currentID.length);
        // get the new array with the column updated for the row i
         finalNewProducts = this.updateColumnArray(finalNewProducts, currentID, "QuantityD", quantityValue, "N");
    }
    // console.table(finalNewProducts)

    this._orderItems = finalNewProducts;
    this.draftValues =[];

    const selectedEvent = new CustomEvent('finallistdraftproduct', { detail: this._orderItems});
            this.dispatchEvent(selectedEvent);

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
                    [columnName6] : currentRow[columnName6]? currentRow[columnName6] : ""
                   
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
                    [columnName6] : (columnName===columnName6) ? _columnValue : currentRow[columnName6] ? currentRow[columnName6] : ""
                    
             
            });
        }
     }
     console.table(newArray)
        return newArray;
    }
}