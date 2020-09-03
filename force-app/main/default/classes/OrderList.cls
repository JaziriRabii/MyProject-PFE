public with sharing class OrderList {
  
    @AuraEnabled
    public static List <Order> getSearchOrders(String orderNumber) {
         String key = '%'+orderNumber+'%';
        List<Order> listOrd =[SELECT Id, OrderNumber, Name, AccountName__c ,
               EffectiveDate, TotalAmount
                 FROM Order where OrderNumber like :key];
    
                 return listOrd;
                }
}