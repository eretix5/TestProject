public with sharing class PurchaseController {
    @AuraEnabled(cacheable=true)
    public static Account getAccount(Id accountId) {
        return [SELECT Id, Name, AccountNumber, Industry FROM Account WHERE Id = :accountId];
    }
    public PurchaseController() {

    }
}