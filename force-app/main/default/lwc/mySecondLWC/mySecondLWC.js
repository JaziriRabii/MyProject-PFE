import { LightningElement,track, wire } from 'lwc';

import  TestName from '@salesforce/apex/UtilityClass.TestName';
export default class MySecondLWC extends LightningElement {
    @track greeting = "Welcome rabii";
    @track message = "LWC Methodology";
    @track contacts =  [
        {
           Id : '001234567876543212',
           Name : 'rabii'
        },
        {
            Id : '001234567876543515',
            Name : 'sami'     
        },
        {
            Id : '001234567876543818',
            Name : 'jaziri'       
        }
    ];
    @wire (TestName) records;
}