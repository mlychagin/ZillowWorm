public class APIScraper {
    private String zid;

    public APIScraper(String zid) {
        this.zid = zid;
    }

    //http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz17fmgq5j9qj_6zfs6&address=9207+Rowlands+Sayle+Rd&citystatezip=Austin%2C+TX&rentzestimate=true

    public double findHouseROI(String address) {
        StringBuilder b = new StringBuilder();

        //API Call
        b.append("http://www.zillow.com/webservice/GetSearchResults.htm?");

        //Zid
        b.append("zws-id=");
        b.append(zid);

        //Address
        b.append("&address=");
        String street = address.substring(0, address.indexOf(","));
        street = street.replace(' ', '+');
        b.append(street);

        //City
        b.append("&citystatezip=");
        int firstIndex = address.indexOf(",", 0);
        String city = address.substring(firstIndex + 2, address.indexOf(",", firstIndex + 1));
        b.append(city);

        //

        return 0;
    }
}
