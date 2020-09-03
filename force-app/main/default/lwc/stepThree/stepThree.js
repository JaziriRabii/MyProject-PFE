import { LightningElement, api, track } from 'lwc';
// import {updateColumnArray} from 'c/stepTwo';

export default class StepThree extends LightningElement {

    @api steplocations = [];
    draftValues;
    products;
    
    connectedCallback() {
       
        this.products =this.splitSitesProducts(this.steplocations);
        console.log('thisproducts'+this.products)
    }
   
//     get OrderNumber(){
//         return this.steplocations[0].OrderNumber;
//     }
    
// get OrderName(){
    
//     return this.steplocations[0].Name;
    
// }

// get Supplier(){
//     return this.steplocations[0].AccountName__c;
// }

// get Date(){
//     return this.steplocations[0].EffectiveDate;
// }



    @track columns = [{
        label: 'Product Code',
        fieldName: 'ProductCode',
        type: 'text',
        sortable: true
    },
    {
        label: 'Product Name',
        fieldName: 'ProductName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Ordered',
        fieldName: 'Quantity',
        type: 'number',
        sortable: true
    },
    {
        label: 'Location',
        fieldName: 'Location',
        type:'text',
        
    },
    {
    label: 'Quantity',
        fieldName: 'QuantityL',
        type:'number',
        editable: true
    }
];

get OrderProducts() {
        
    return this.products;
}













handleSaveDraftValues(event) {
    console.log(JSON.stringify(this.steplocations))
    //define an array that contains only the draft Values
    let draftValues =  event.detail.draftValues;
    console.log('draft v '+JSON.stringify(draftValues))
    //define a new array and inialize it with the existing products in the datatable
    let finalNewProducts = [];
    finalNewProducts = JSON.parse(JSON.stringify(this.products));
    console.table(finalNewProducts);
    // iterate for all rows in draftvalues array and call updateColumnArray for each row
    for(let i=0;i<draftValues.length; i++) {
        //get the columnName parameter
         let quantityValue = draftValues[i].QuantityL;
         console.log('quantityValue'+quantityValue);

        //  get the selectedRows parameter
         let currentID = [];
         currentID[0] = draftValues[i].Id;

         console.log('curr'+currentID.length);
        // get the new array with the column updated for the row i
         finalNewProducts = this.updateColumnArray(finalNewProducts, currentID, "QuantityL", quantityValue, "N");
    }
    // console.table(finalNewProducts)

    this.products = finalNewProducts;
    this.draftValues =[];

    const selectedEvent = new CustomEvent('finallistproduct', { detail: this.products});
            this.dispatchEvent(selectedEvent);

}

splitSitesProducts(selectedProducts) {

    let finalProducts = [];
    //Iterate over the given addresses
    for (let i = 0; i < selectedProducts.length; i++) {
        //The current product
        let currentProduct = selectedProducts[i];
        //Split the sites type to an array
        let locationsArray = currentProduct.Location ? currentProduct.Location.split(',') : [];
        //More then one site
        if (locationsArray.length > 0) {
            //Iterate over each site
            for (let j = 0; j < locationsArray.length; j++) {
                //the first id is conserved and the others contain the count of the navigation from step 2 to step 3 concatenated with _j
                //ID_1_1 means the duplicated product ID the first time the user nvigate from step 2 to step 3
                //ID_2_1 means the duplicated product ID the second time the user navigate from step 2 to step 3 after using earlier the Previous Button.       
                finalProducts.push({
                    // j == '0' ? currentProduct.Id : 
                    Id: currentProduct.Id + '_' + j,
                    ProductCode: currentProduct.ProductCode,
                    ProductName: currentProduct.ProductName,
                   Quantity: currentProduct.Quantity,
                    Location:  locationsArray[j],
                    QuantityL: currentProduct.QuantityL
                   

                });
            }
        }
     }
   
    return finalProducts;
    console.log(finalProducts);
}
 
updateColumnArray (oldArray, selectedRows, columnName, columnValue, isValueCalculated) {
        console.log('update');
        //define the columns of the datatable
        const columnName1 = "Id";
        const columnName2 = "ProductCode";
        const columnName3 = "ProductName";
        const columnName4 = "Quantity";
        const columnName5 = "Location";
        const columnName6 = "QuantityL";
       

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