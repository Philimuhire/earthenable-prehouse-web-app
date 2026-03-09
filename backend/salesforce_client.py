import os

from dotenv import load_dotenv
from simple_salesforce import Salesforce

load_dotenv()

SF_USERNAME = os.getenv("SF_USERNAME")
SF_PASSWORD = os.getenv("SF_PASSWORD")
SF_SECURITY_TOKEN = os.getenv("SF_SECURITY_TOKEN")

CUSTOMER_RECORD_TYPE_ID = "0121t000000QgSDAA0"


def get_sf() -> Salesforce:
    return Salesforce(
        username=SF_USERNAME,
        password=SF_PASSWORD,
        security_token=SF_SECURITY_TOKEN,
    )


def search_villages(sf: Salesforce, query: str) -> list[dict]:
    soql = (
        "SELECT Id, Name, Umudugudu_Cell__c, Umudugudu_Sector__c, "
        "Umudugudu_District__c, Country__c "
        "FROM Location__c "
        "WHERE Type__c = 'Umudugudu' "
        f"AND Name LIKE '%{_escape(query)}%' "
        "ORDER BY Name LIMIT 20"
    )
    result = sf.query(soql)
    return [
        {
            "id": r["Id"],
            "name": r["Name"],
            "cell": r.get("Umudugudu_Cell__c") or "",
            "sector": r.get("Umudugudu_Sector__c") or "",
            "district": r.get("Umudugudu_District__c") or "",
            "country": r.get("Country__c") or "",
        }
        for r in result["records"]
    ]


def search_employees(sf: Salesforce, query: str) -> list[dict]:
    soql = (
        "SELECT Id, Name, Phone, MobilePhone, "
        "Advancement_Level__c, Work_Location__c "
        "FROM Contact "
        "WHERE RecordType.Name IN ('Staff','Field Staff','Customer Sales Officer') "
        f"AND Name LIKE '%{_escape(query)}%' "
        "ORDER BY Name LIMIT 20"
    )
    result = sf.query(soql)
    return [
        {
            "id": r["Id"],
            "name": r["Name"],
            "phone": r.get("Phone") or r.get("MobilePhone") or "",
            "advancementLevel": r.get("Advancement_Level__c") or "",
            "workLocation": r.get("Work_Location__c") or "",
        }
        for r in result["records"]
    ]


def search_customers(sf: Salesforce, query: str) -> list[dict]:
    escaped = _escape(query)
    soql = (
        "SELECT Id, Name, Phone, Customer_Phone_Number__c, "
        "Umudugudu_Text__c, Umudugudu_District__c, Umudugudu_Country__c, "
        "Primary_Contact__c, Primary_Contact__r.FirstName, "
        "Primary_Contact__r.LastName, Unique_Customer_ID__c "
        "FROM Account "
        f"WHERE (Name LIKE '%{escaped}%' OR Phone LIKE '%{escaped}%' "
        f"OR Customer_Phone_Number__c LIKE '%{escaped}%') "
        "ORDER BY Name LIMIT 20"
    )
    result = sf.query(soql)
    records = []
    for r in result["records"]:
        contact = r.get("Primary_Contact__r") or {}
        first = contact.get("FirstName") or ""
        last = contact.get("LastName") or ""
        if not first and not last:
            name_part = r["Name"].split("|")[0].strip()
            parts = [p for p in name_part.split() if not p[0].isdigit() and p != "-"]
            if len(parts) >= 2:
                first = parts[0]
                last = " ".join(parts[1:])
            elif parts:
                last = parts[0]
        records.append({
            "id": r["Id"],
            "name": r["Name"],
            "firstName": first,
            "lastName": last,
            "phone": r.get("Phone") or r.get("Customer_Phone_Number__c") or "",
            "village": r.get("Umudugudu_Text__c") or "",
            "district": r.get("Umudugudu_District__c") or "",
            "country": r.get("Umudugudu_Country__c") or "",
            "contactId": r.get("Primary_Contact__c") or "",
            "customerCode": r.get("Unique_Customer_ID__c") or "",
        })
    return records


def get_picklists(sf: Salesforce) -> dict:
    desc = sf.Opportunity.describe()
    fields_to_get = {
        "Phase__c": "phase",
        "House__c": "house",
    }
    result = {}
    for f in desc["fields"]:
        if f["name"] in fields_to_get:
            key = fields_to_get[f["name"]]
            result[key] = [v["value"] for v in f["picklistValues"] if v["active"]]
    result["category"] = ["Above Social Registry", "Below Social Registry"]
    result["country"] = ["Rwanda", "Uganda", "Kenya"]
    result["productInterest"] = [
        "Floor_Standard Clear | DirectSale",
        "Floor_Standard Clear | DirectSale",
        "Plaster_Interior | DirectSale",
        "Plaster_Exterior | DirectSale",
    ]
    return result


def create_account(sf: Salesforce, data: dict) -> dict:
    contact = sf.Contact.create({
        "RecordTypeId": CUSTOMER_RECORD_TYPE_ID,
        "Salutation": data.get("salutation"),
        "FirstName": data["firstName"],
        "LastName": data["lastName"],
        "Phone": data.get("phone"),
    })
    contact_id = contact["id"]

    account_name = f"{data['firstName']} {data['lastName']}"
    account_data = {
        "Name": account_name,
        "Primary_Contact__c": contact_id,
        "Phone": data.get("phone"),
    }
    account_data = {k: v for k, v in account_data.items() if v is not None}
    account = sf.Account.create(account_data)

    sf.Contact.update(contact_id, {"AccountId": account["id"]})

    return {"contactId": contact_id, "accountId": account["id"]}


def _build_opp_name(data: dict) -> str:
    name = f"{data['firstName']} {data['lastName']}"
    house = data.get("house") or ""
    phase = data.get("phase") or ""
    if house and phase:
        name += f" {house} - {phase}"
    elif house:
        name += f" {house}"
    return name


def create_opportunity(sf: Salesforce, data: dict) -> dict:
    discount = "No" if data.get("category") == "Above Social Registry" else "Yes"
    opp_name = _build_opp_name(data)
    opp_data = {
        "Name": opp_name,
        "AccountId": data.get("accountId"),
        "StageName": "Closed Won",
        "CloseDate": data["customerSignedDate"],
        "Customer__c": data["customerId"],
        "Country__c": data.get("country", "Rwanda"),
        "Umudugudu__c": data.get("villageId"),
        "House__c": data.get("house"),
        "Phase__c": data.get("phase"),
        "Total_Square_Meters__c": data.get("totalSquareMeters"),
        "New_Product_Interest__c": data.get("productInterest"),
        "Signed_By_Employee__c": data.get("employeeId"),
        "Customer_Signed_Date__c": data["customerSignedDate"],
        "Discount_2026_allowed__c": discount,
    }
    opp_data = {k: v for k, v in opp_data.items() if v is not None}
    result = sf.Opportunity.create(opp_data)
    return {"id": result["id"], "success": result["success"]}


def _escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("'", "\\'").replace("%", "\\%").replace("_", "\\_")
