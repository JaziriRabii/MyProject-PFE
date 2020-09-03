import { LightningElement, wire } from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class Content extends LightningElement {
 selecteditem;

@wire(CurrentPageReference) pageRef;

connectedCallback() {
    registerListener('menuselected',this.handleMenuSelected,this) ;
    }
    disconnectedCallback() {
    unregisterAllListeners(this) ;
    }
     
     handleMenuSelected (item){
     this.selecteditem = item
    console.log('hello')
        }

    get isReceiving(){
      return this.selecteditem =="receiving"
                     }

   get isShipping(){
   return this.selecteditem =="shipping"
                   }
 get isReordering(){
     return this.selecteditem =="reordering"
                } 

 get isInventory(){
    return this.selecteditem =="inventory"
                }
 get isSettings(){
    return this.selecteditem =="settings"
              }

}