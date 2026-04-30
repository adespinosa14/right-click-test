import json

def Customers():
    with open("data/customers.json", "r") as file:
        data = json.load(file)

            # Customer Identity
        for customers in data:
            id = customers.get("id", "N/A")
            name = customers.get("name", "N/A")
            address = customers.get("address", "N/A")
            phone = customers.get("phone", "N/A")

            # Customer Home
            propertyType = customers.get('propertyType', customers.get('property_type', 'N/A'))
            squareFootage = customers.get('squareFootage', 'N/A')
            
            # System
            systemType = customers.get('systemType', 'N/A')
            systemAge = customers.get('systemAge', 'N/A')
            lastServiceDate = customers.get('lastServiceDate', 'N/A')

            print('-------------------------------------------------------------------------------------------\n')
            print(f'Identity: {id} - {name} - {address} - {phone}')
            print(f'Property: {propertyType} - {squareFootage}')
            print(f'System {systemType} - {systemAge} - {lastServiceDate}')
            print('\n-------------------------------------------------------------------------------------------')