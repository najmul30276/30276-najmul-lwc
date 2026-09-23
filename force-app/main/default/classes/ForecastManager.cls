public with sharing class ForecastManager {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunity() { 
        List<Opportunity> opp = [SELECT Id, Name, Amount, Probability, Expected_Revenue_Overridden__c, CloseDate FROM Opportunity WHERE CloseDate IN (THIS_MONTH)];
        return opp;
    }

    @AuraEnabled
    public static void updateExpectedRevenue(Id oppId) {
        Opportunity opp = [SELECT Id, Amount, Probability, Expected_Revenue_Overridden__c FROM Opportunity WHERE Id = :oppId LIMIT 1];
        if(opp.Amount>2000000 && opp.Probability > 50){
           opp.Expected_Revenue_Overridden__c = (opp.Amount * 15)/100; 
        }else{
            opp.Expected_Revenue_Overridden__c = (opp.Amount * 10)/100;
        }
        update opp;
    }
}