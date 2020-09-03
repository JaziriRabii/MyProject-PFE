import { LightningElement, track, wire } from 'lwc';
import insertListProduct from '@salesforce/apex/OrderClass.insertListProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getLocationList from '@salesforce/apex/OrderClass.getLocationList';
import getProductsList from '@salesforce/apex/OrderClass.getProductsList';

export default class ProcessEntry extends LightningElement {
    @track selectedStep = 'Step1';
    selectedrow = [];
    productlocations = [];
    finalproducts = [];
    keycode;

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
    @wire(getProductsList)
    wiredproduct({
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
    handleNext() {
        var getselectedStep = this.selectedStep;
        if (getselectedStep === 'Step1') {
            // this.selectedrow = this.template.querySelector('c-step-one').selectedRow();
            //      console.table(this.selectedrow)

            this.selectedStep = 'Step2';






        }
        else if (getselectedStep === 'Step2') {

            // this.keycode = this.template.querySelector('c-step-two').this;
            // console.log('keycode'+this.selectedrow[0].Id)
            this.selectedStep = 'Step3';

        }
        else if (getselectedStep === 'Step3') {
            // let keycode = this.template.querySelector('c-step-two').OrderNumber;
            // console.log(keycode)

            //restore the correct values of product IDs after adding "_j" du to the datatable manipulation need
           

            this.selectedStep = 'Step4';
        }
        else if (getselectedStep ==='Step4') {
            var productsLines = this.finalproducts;
            for (let i = 0; i < productsLines.length; i++) {
                productsLines[i].Id = productsLines[i].Id.substring(0, 18);
            }
            console.log('finalprod' + JSON.stringify(productsLines));

            // var RfqLines = JSON.stringify(productsLines);
            // console.log(RfqLines);
            // save({ RfqLines: RfqLines })
            // .then(() => {
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Success',
            //             message: 'Saving data is done successfully',
            //             variant: 'success',
            //         }),
            //     );
            // })
            // .catch(error => {
            //     this.dispatchEvent(
            //         new ShowToastEvent({
            //             title: 'Error while Saving data',
            //             message: error.message,
            //             variant: 'error',
            //         }),
            //     );
            // });
            //    setTimeout(() => {
            //     this.closeModal();

            // }, 2000);

            
            //array { Id, Name}
            let locationWorkOrderProduct__cList = productsLines.map(p => {
                // console.log('--->');
                // console.log(p.ProductCode);
                // if (this.listProds.filter(x => x.ProductCode == p.ProductCode.toString())[0].Id != null
                //     && this.listLocation.filter(l => l.Name == p.Location)[0].Id
                // ) {
                //    let idProd=this.listProds.filter(x => x.ProductCode == String(p.ProductCode))[0].Id
                //    console.log('++'+idProd)
                console.log('location'+this.listLocation)
                   let idlocation =  this.listLocation.filter(l => l.Name == String(p.Location))[0].Id
                   console.log('==='+idlocation)
                    return {
                        Product__c: this.listProds.filter(x => x.ProductCode == String(p.ProductCode))[0].Id,
                        QuantityReceived__c: p.QuantityL,
                        Location__c: this.listLocation.filter(l => l.Name == String(p.Location))[0].Id,
                    }
                // } 
            })
            console.table(JSON.stringify(locationWorkOrderProduct__cList));

            //  orderId : this.selectedrow[0].Id, 
            insertListProduct({ products: locationWorkOrderProduct__cList })
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
        if (getselectedStep === 'Step2') {
            this.selectedStep = 'Step1';
        }
        else if (getselectedStep === 'Step3') {
            this.selectedStep = 'Step2';
        }
        else if (getselectedStep === 'Step4') {
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


    handleFinalListProduct(event) {

        this.finalproducts = event.detail;
        console.table(this.finalproducts)

    }


    handleProductLocation(e) {
        this.productlocations = e.detail;
        console.log('event detail received is ' + JSON.stringify(this.productlocations))
    }

}