public class PurchaseLineCalc {
    public static void recalculateTotals(Set<Id> purchaseIds) {
        Map<Id, Decimal> itemSums = new Map<Id, Decimal>();
        Map<Id, Decimal> priceSums = new Map<Id, Decimal>();

        for (PurchaseLine_c__c line : [
            SELECT Purchase_c__c, Amount__c, UnitCost__c
            FROM PurchaseLine_c__c
            WHERE Purchase_c__c IN :purchaseIds
        ]) {
            Id purchaseId = line.Purchase_c__c;
            Decimal amt = line.Amount__c != null ? line.Amount__c : 0;
            Decimal cost = line.UnitCost__c != null ? line.UnitCost__c : 0;

            itemSums.put(purchaseId, itemSums.get(purchaseId) != null ? itemSums.get(purchaseId) + amt : amt);
            Decimal lineTotal = amt * cost;
            priceSums.put(purchaseId, priceSums.get(purchaseId) != null ? priceSums.get(purchaseId) + lineTotal : lineTotal);
        }

        List<Purchase_c__c> updates = new List<Purchase_c__c>();

        for (Id id : purchaseIds) {
            Decimal items = itemSums.containsKey(id) ? itemSums.get(id) : 0;
            Decimal price = priceSums.containsKey(id) ? priceSums.get(id) : 0;

            updates.add(new Purchase_c__c(
                Id = id,
                TotalItems__c = items,
                GrandTotal__c = price
            ));
        }

        if (!updates.isEmpty()) {
            update updates;
        }
    }
}



