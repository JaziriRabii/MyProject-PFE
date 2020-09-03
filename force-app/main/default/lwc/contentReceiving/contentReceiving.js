import { LightningElement,track } from 'lwc';

export default class ContentReceiving extends LightningElement {
    @track openmodel = false;
    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 
    
    
   
}