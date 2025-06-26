public with sharing class PurchaseController {
    @AuraEnabled(cacheable=true)
    public static Account getAccount(Id accountId) {
        return [SELECT Id, Name, AccountNumber, Industry FROM Account WHERE Id = :accountId];
    }
    public PurchaseController() {

    }
    @AuraEnabled
    public static Id createPurchase(Id accountId, List<Map<String, Object>> cartRaw) {
		try {
			System.debug('Incoming cartRaw: ' + JSON.serializePretty(cartRaw));
			List<PurchaseLine_c__c> lines = new List<PurchaseLine_c__c>();
			Decimal total = 0;
			Integer totalItems = 0;

			for (Map<String, Object> c : cartRaw) {
				//if (c.Id == null || c.price == null || c.quantity == null) {
					//throw new AuraHandledException('Invalid cart item');
				//}
			Id itemId = (Id) c.get('Id');
			Decimal price = Decimal.valueOf(c.get('price') + '');
			Integer quantity = Integer.valueOf(c.get('quantity') + '');
			total += price * quantity;
			totalItems += quantity;

			lines.add(new PurchaseLine_c__c(
				Purchase_c__c = null, // placeholder
				ItemId__c = itemId,
				Amount__c = quantity,
				UnitCost__c = price
			));
		}

			Purchase_c__c purchase = new Purchase_c__c(
				Name = 'New Purchase - ' + DateTime.now().format(),
				Account__c = accountId
				//TotalItems__c = totalItems,
				//GrandTotal__c = total
			);
			insert purchase;

			for (PurchaseLine_c__c pl : lines) {
				pl.Purchase_c__c = purchase.Id;
			}
			insert lines;
			for (PurchaseLine_c__c pl : [SELECT Id, Purchase_c__c, Amount__c, UnitCost__c FROM PurchaseLine_c__c WHERE Purchase_c__c = :purchase.Id]) {
				System.debug('DEBUG LINE: ' + JSON.serializePretty(pl));
			}
			List<PurchaseLine_c__c> checkLines = [
				SELECT Id, Purchase_c__c, ItemId__c, Amount__c, UnitCost__c
				FROM PurchaseLine_c__c
				WHERE Purchase_c__c = :purchase.Id
			];
			System.debug('=== Inserted Lines in DB ===');
			for (PurchaseLine_c__c pl : checkLines) {
				System.debug(JSON.serializePretty(pl));
			}
			PurchaseLineCalc.recalculateTotals(new Set<Id>{ purchase.Id });
			return purchase.Id;
		}
		catch (Exception e) {
		    System.debug('ERROR TYPE: ' + e.getTypeName());
			System.debug('ERROR MESSAGE: ' + e.getMessage());
			System.debug('STACK TRACE: ' + e.getStackTraceString());
			System.debug('FULL ERROR: ' + JSON.serialize(e));

			throw new AuraHandledException(
				'Server error. Type: ' + e.getTypeName() +
				' | Message: ' + e.getMessage() +
				' | StackTrace: ' + e.getStackTraceString()
			);
        }
    }


    //public class CartItem {
        //@AuraEnabled public Id Id;
        //@AuraEnabled public Decimal price;
        //@AuraEnabled public Integer quantity;
    //}
}