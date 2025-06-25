public with sharing class PurchaseController {
    @AuraEnabled(cacheable=true)
    public static Account getAccount(Id accountId) {
        return [SELECT Id, Name, AccountNumber, Industry FROM Account WHERE Id = :accountId];
    }
    public PurchaseController() {

    }
    @AuraEnabled
    public static Id createPurchase(Id accountId, List<CartItem> cart) {
        if (accountId == null || cart == null || cart.isEmpty()) {
            throw new AuraHandledException('Invalid data provided.');
        }

        Decimal total = 0;
        Integer totalItems = 0;

        for (CartItem c : cart) {
            total += c.price * c.quantity;
            totalItems += c.quantity;
        }

        Purchase_c__c purchase = new Purchase_c__c(
            Name = 'New Purchase - ' + DateTime.now().format(),
            Account__c = accountId
        );
        insert purchase;

        List<PurchaseLine_c__c> lines = new List<PurchaseLine_c__c>();

        for (CartItem c : cart) {
            lines.add(new PurchaseLine_c__c(
                Purchase_c__c = purchase.Id,
                ItemId__c = c.Id,
                Amount__c = c.quantity,
                UnitCost__c = c.price
            ));
        }

        insert lines;

        return purchase.Id;
    }

    public class CartItem {
        @AuraEnabled public Id Id;
        @AuraEnabled public Decimal price;
        @AuraEnabled public Integer quantity;
    }
}