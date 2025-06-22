public with sharing class ItemController {
    @AuraEnabled(cacheable=true)
    public static List<Item__c> getItems() {
        return [SELECT Id, Name, Description, Type, Family, Image, Price FROM Item__c];
    }
    public ItemController() {

    }
}