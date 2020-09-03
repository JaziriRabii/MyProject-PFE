public with sharing class OrderClass {
    public OrderClass() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Order> getOrderList() {
        List<Order> listAcc =[SELECT Id, OrderNumber, Name, AccountName__c ,
        EffectiveDate, TotalAmount
                 FROM Order where RecordTypeId='0124J000000MP5zQAG'];
    system.debug(listAcc);
                 return listAcc;
                }


              @AuraEnabled(cacheable=true)
              public static List<Order> getOrderProduct(String orderId){
                // String Id = String.valueOf(Id);
               //  Integer Id = String.valueOf(Id) ;
                  List<Order> listProd = [ SELECT Id, Name,
                   (SELECT Id, Quantity,Product2.Name,Product2.ProductCode  FROM OrderItems)
            FROM Order
            where OrderNumber =: orderId
             ];

                  system.debug(listProd[0]);
                  system.debug(listProd[0].OrderItems);
                  system.debug(listProd[0].OrderItems.size());
                  return listProd;
              }  



@AuraEnabled(cacheable=true)
public static List<Location__c> getLocationList(){
  List<Location__c> listloc = [SELECT Id,Name FROM Location__c ];
  return listloc;
  
}


@AuraEnabled(cacheable=true)
public static List<Agent__c> getAgentList(){
  List<Agent__c> listloc = [SELECT Id,Name FROM Agent__c ];
  return listloc;

  
}





@AuraEnabled(cacheable=true)
public static List<Product2> getProductsList(){
  List<Product2> listProds = [SELECT Id,ProductCode FROM Product2 ];
  system.debug(listProds);
  return listProds;
  
}

@AuraEnabled(cacheable=true)
public static List<Product2> getProductsListName(){
  List<Product2> listProds = [SELECT Id,Name FROM Product2 ];
  system.debug(listProds);
  return listProds;
  
}

@AuraEnabled
public static void insertListProduct(List<LocationWorkOrderProduct__c> products ){
insert products;
}

@AuraEnabled
public static void insertProductShipping(List<LocationProductShipping__c> products ){
insert products;
}

// @AuraEnabled(cacheable=true)
// public static List<LocationWorkOrderProduct__c> getNewProductsList(){
//   List<LocationWorkOrderProduct__c> listProds =[SELECT Id, Product__c, QuantityReceived__c, Location__c, QuantityAvailable__c

//                                           from LocationWorkOrderProduct__c ];
//   system.debug(listProds);
//   return listProds;
//   }


  @AuraEnabled(cacheable=true)
  public static List<Order>  getNewProductsList(String orderId){
    // String Id = String.valueOf(Id);
   //  Integer Id = String.valueOf(Id) ;
      List<Order> listProd =[SELECT Id, Name,
      (SELECT  Id, Product__r.Name, QuantityReceived__c, Location__r.Name, QuantityAvailable__c  FROM LocationsWorkOrdersProducts__r)
     FROM Order
                              where OrderNumber =: orderId
 ];
 system.debug(listProd);
  return listProd;
  }


//   List<LocationWorkOrderProduct__c> lst  = new List<LocationWorkOrderProduct__c>();

//   for (LocationWorkOrderProduct__c  p :  products) {
//     LocationWorkOrderProduct__c el = new  LocationWorkOrderProduct__c();
   
//     el.Product__c = p.Id;
//     // el.QuantityReceived__c = p.QuantityReceived__c;
//     // ID idLocation = [select Id from Location__c where Name = :p.Location];
//     // el.Location__c = idLocation;
//     lst.add(el);
  // }

  // system.debug(lst);
  // insert lst;



@AuraEnabled(cacheable=true)
public static List<Order> getOrderCustomList() {
    List<Order> listAc =[SELECT Id, OrderNumber, Name, AccountName__c ,
    EffectiveDate, TotalAmount
             FROM Order where RecordTypeId='0124J000000MP64QAG'];
system.debug(listAc);
             return listAc;
            }





}