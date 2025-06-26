public with sharing class UserController {
    @AuraEnabled
    public static Boolean checkIsManager() {
        //User u = [SELECT Id, IsManager__c FROM User WHERE Id = :UserInfo.getUserId()];
        //return u.IsManager__c;
		return true;
    }
}
