public with sharing class Unsplash {
    private static final String ACCESS_KEY = 'npFThYWk1GA19d6Y7zcUBxHkpdCKmkE_3zOkIgT3vPs';

    @AuraEnabled
    public static String getImageUrl(String query) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.unsplash.com/search/photos?query=' + EncodingUtil.urlEncode(query, 'UTF-8') + '&client_id=' + ACCESS_KEY);
        req.setMethod('GET');

        HttpResponse res = http.send(req);
        if (res.getStatusCode() == 200) {
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Object> photos = (List<Object>) result.get('results');
            if (!photos.isEmpty()) {
                Map<String, Object> first = (Map<String, Object>) photos[0];
                Map<String, Object> urls = (Map<String, Object>) first.get('urls');
                return (String) urls.get('regular');
            }
        }
        return null;
    }
}
