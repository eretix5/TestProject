trigger PurchaseLineTrigger on PurchaseLine_c__c (after insert, after update, after delete, after undelete) {
    Set<Id> purchaseIds = new Set<Id>();

    if (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete) {
        for (PurchaseLine_c__c pl : Trigger.new) {
            if (pl.Purchase_c__c != null) {
                purchaseIds.add(pl.Purchase_c__c);
            }
        }
    }

    if (Trigger.isUpdate || Trigger.isDelete) {
        for (PurchaseLine_c__c pl : Trigger.old) {
            if (pl.Purchase_c__c != null) {
                purchaseIds.add(pl.Purchase_c__c);
            }
        }
    }

    if (!purchaseIds.isEmpty()) {
        //PurchaseLineCalc.recalculateTotals(purchaseIds);
    }
}
