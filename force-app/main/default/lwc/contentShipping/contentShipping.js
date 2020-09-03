import { LightningElement,track } from 'lwc';

export default class ContentShipping extends LightningElement {
    @track openmodel = false;
    openmodal() {
        this.openmodel = true
    }
    closeModal() {
        this.openmodel = false
    } 
}