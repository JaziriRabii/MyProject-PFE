import { LightningElement,track, wire } from 'lwc';
import getLocationList from '@salesforce/apex/OrderClass.getLocationList';
import getProductsListName from '@salesforce/apex/OrderClass.getProductsListName';
import getAgentList from '@salesforce/apex/OrderClass.getAgentList';
import insertProductShipping from '@salesforce/apex/OrderClass.insertProductShipping';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProcessExit extends LightningElement {

    @track selectedStep = 'Step1';
    selectedrow = [];
    productslistfinal = [];
    finalproductsshipping = [];

@track listAgents;
    @track listProds;
    @track listLocation;

    @wire(getLocationList)
    wiredlocation({
        error,
        data
    }) {
        if (data) {
            console.log('data ' + JSON.stringify(data));
            this.listLocation = data;
        } else if (error) {
            this.error = error;
        }
    }

 //returns [{Id,ProductCode]}];
 @wire(getProductsListName)
 wiredProduct({
     error,
     data
 }) {
     if (data) {
         console.log('data ' + JSON.stringify(data));
         this.listProds = data;
     } else if (error) {
         this.error = error;
     }
 };

 @wire(getAgentList)
 wiredAgent({
     error,
     data
 }) {
     if (data) {
         console.log('data ' + JSON.stringify(data));
         this.listAgents = data;
     } else if (error) {
         this.error = error;
     }
 };







    handleNext() {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step1'){
          
  
            this.selectedStep = 'Step2';
           
             
              
              
               
         
        }
        else if(getselectedStep === 'Step2'){
         
          
            this.selectedStep = 'Step3';
             
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step4';
            console.log(JSON.stringify( this.finalproductsshipping));
         
        }
        else if(getselectedStep ==='Step4'){
            var productsLines = this.finalproductsshipping;
            for (let i = 0; i < productsLines.length; i++) {
                productsLines[i].Id = productsLines[i].Id.substring(0, 18);
            }
            console.log('finalprodss' + JSON.stringify(productsLines));
            console.log('finalLocations' + JSON.stringify(this.listLocation));
            console.log('finalProductss' + JSON.stringify(this.listProds));
            console.log('finalAgents' + JSON.stringify(this.listAgents));
            
            let LocationProductShipping__cList = productsLines.map(p => {
                // console.log('--->');
                // console.log(p.ProductCode);
                // if (this.listProds.filter(x => x.ProductCode == p.ProductCode.toString())[0].Id != null
                //     && this.listLocation.filter(l => l.Name == p.Location)[0].Id
                // ) {
                 
                // console.log('location'+this.listLocation)
                   let idlocation =  this.listLocation.filter(l => l.Name == String(p.Location))[0].Id
                   console.log('==='+idlocation)
                //    let idProd  =    this.listProds.filter(x => x.Name == String(p.Product))[0].Id
                //    console.log('++'+idProd)
                    return {
                        // ProductShipping__c: this.listProds.filter(x => x.Name== String(p.Product))[0].Id,
                        // AgentShipping__c:this.listAgents.filter( d=> d.Name == String(p.Agent))[0].Id,
                        QuantityDelivered__c: p.QuantityD,
                        LocationShipping__c: this.listLocation.filter(l => l.Name == String(p.Location))[0].Id,
                    }
                // } 
            })
            console.table(JSON.stringify(LocationProductShipping__cList));

            //  orderId : this.selectedrow[0].Id, 
            insertProductShipping({ products: LocationProductShipping__cList })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Saving data is done successfully',
                            variant: 'success',
                        }),
                    );
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error while Saving data',
                            message: error.message,
                            variant: 'error',
                        }),
                    );
                });
        }
    }

    handlePrev() {
        var getselectedStep = this.selectedStep;
        if(getselectedStep === 'Step2'){
            this.selectedStep = 'Step1';
        }
        else if(getselectedStep === 'Step3'){
            this.selectedStep = 'Step2';
        }
        else if(getselectedStep === 'Step4'){
            this.selectedStep = 'Step3';
        }
    }

    handleFinish() {
        alert('Finished...');
        this.selectedStep = 'Step1';
    }
      
    selectStep1() {
        this.selectedStep = 'Step1';
    }
    get isSelectStep1() {
      return this.selectedStep === "Step1";
  }
  
    selectStep2() {
        this.selectedStep = 'Step2';
    }
    get isSelectStep2() {
      return this.selectedStep === "Step2";
  }
  
    selectStep3() {
        this.selectedStep = 'Step3';
    }
    
    get isSelectStep3() {
        return this.selectedStep === "Step3";
    }
  
    selectStep4() {
        this.selectedStep = 'Step4';
    }
  
    get isSelectStep4() {
        return this.selectedStep === "Step4";
    }

    handleOnSelectedRow(event) {
        //   console.log('cc');
        this.selectedrow = event.detail;
        console.log('event detail received is ' + JSON.stringify(this.selectedrow))
    }

    handlelistProducts(event){
this.productslistfinal = event.detail;
console.log('event detail received is ' + JSON.stringify(this.productslistfinal))
}
handleFinalProductLocation(event) {

    this.finalproductsshipping = event.detail;
    console.table(this.finalproductsshipping)

}

    }