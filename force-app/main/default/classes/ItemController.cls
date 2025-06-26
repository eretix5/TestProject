public with sharing class ItemController {
    @AuraEnabled(cacheable=true)
    public static List<Item_c__c> getItems() {
        return [SELECT Id, Name, Description__c, Type__c, Family__c, Image__c, Price__c FROM Item_c__c];
    }
    public ItemController() {

    }
}