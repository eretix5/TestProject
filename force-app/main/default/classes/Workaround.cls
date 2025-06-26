public with sharing class Workaround {
    public Workaround() {

    }
	@AuraEnabled
	public static void createItem(String name, String description, String type, String family, Decimal price, String imageUrl) {
		Item_c__c item = new Item_c__c(
			Name = name,
			Description__c = description,
			Type__c = type,
			Family__c = family,
			Price__c = price,
			Image__c = imageUrl
		);
		insert item;
	}
}