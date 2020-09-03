import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
export default class Menu extends LightningElement {
    @wire(CurrentPageReference) pageRef;


    handleSelect(event){
        // var selecteditem = event.detail.name;
        fireEvent(this.pageRef,'menuselected', event.detail.name);
         console.log('firing event'+event.detail.name);
        
    }
    
}