import json
from equipment import Equipment
from category_parser import Category_Parser
from labor import Labor

def Customers():
    with open("data/customers.json", "r") as file:
        customer_data = json.load(file)

            # Customer Identity
        for customers in customer_data:
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
            equipment = Equipment(Category_Parser(systemType))

            print(f'\nID: {id}')
            print(f'Name: {name}')
            print(f'\nAddress: {address}, Phone: {phone}')
            print(f'Property: {propertyType} - {squareFootage}')
            print(f'\nSystem: {systemType} - {systemAge} years - {lastServiceDate}\n')
            for eq in equipment:
                eq_data = equipment.get(eq)
                print(f"-- {eq} -------")
                for items in eq_data:
                    print(f"    {items['name']} : Cost: ${items['baseCost']}")

            print('\n-------------------------------------------------------------------------------------------')