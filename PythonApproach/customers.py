import json
from equipment import Equipment
from category_parser import Category_Parser
from labor import Labor

def get_tier(bucket):
    sorted_items = sorted(bucket, key=lambda x: x['baseCost'])
    n = len(sorted_items)
    return sorted_items[0], sorted_items[n // 2], sorted_items[-1]

def Customers():
    with open("data/customers.json", "r") as file:
        customer_data = json.load(file)

    # Print the customer list
    print('\nSelect a Customer:')
    for i, customer in enumerate(customer_data, 1):
        name = customer.get('name', 'N/A')
        address = customer.get('address', 'N/A')
        id = customer.get('id', 'N/A')
        print(f'  {i}. {name}  —  {address}  ({id})')

    try:
        choice = int(input('\nEnter number: ')) - 1
        if choice < 0 or choice >= len(customer_data):
            print('Selection Not Found')
            return
    except ValueError:
        print('Please enter a number.')
        return
    
    customer = customer_data[choice]

    # Customer Identity
    id = customer.get("id", "N/A")
    name = customer.get("name", "N/A")
    address = customer.get("address", "N/A")
    phone = customer.get("phone", "N/A")

    # Customer Home
    propertyType = customer.get('propertyType', customer.get('property_type', 'N/A'))
    squareFootage = customer.get('squareFootage', 'N/A')

    # System
    systemType = customer.get('systemType', 'N/A')
    systemAge = customer.get('systemAge', 'N/A')
    lastServiceDate = customer.get('lastServiceDate', 'N/A')

    equipment = Equipment(Category_Parser(systemType))

    # Pick labor rate based on property type and system
    equipment_types = list(equipment.keys())
    if 'Mini-Split' in equipment_types and propertyType != 'commercial':
        labor = Labor('install', 'mini-split')
    elif propertyType == 'commercial':
        labor = Labor('install', 'commercial')
    else:
        labor = Labor('install', 'residential')

    labor_cost = 0
    if labor:
        hours = labor['estimatedHours']
        avg_hours = (hours['min'] + hours['max']) / 2
        labor_cost = labor['hourlyRate'] * avg_hours

    print(f'\nID: {id}')
    print(f'Name: {name}')
    print(f'Address: {address}  Phone: {phone}')
    print(f'Property: {propertyType} - {squareFootage} sq ft')
    print(f'System: {systemType} - {systemAge} yrs - Last Service: {lastServiceDate}\n')

    # Build tiers across all equipment categories
    tier_names = ['Budget', 'Mid', 'Premium']
    tier_totals = [0, 0, 0]
    tier_items = [[], [], []]

    for eq in equipment:
        bucket = equipment[eq]
        if not bucket:
            continue
        low, mid, high = get_tier(bucket)
        for i, item in enumerate([low, mid, high]):
            tier_items[i].append(item)
            tier_totals[i] += item['baseCost']

    for i, tier_name in enumerate(tier_names):
        total = tier_totals[i] + labor_cost
        print(f"  [{tier_name}]")
        for item in tier_items[i]:
            print(f"    {item['category']}: {item['name']}  ${item['baseCost']:,.0f}")
        if labor:
            print(f"    Labor ({labor['jobType']} / {labor['level']}): ${labor_cost:,.0f}")
        print(f"    Total: ${total:,.0f}\n")

    print('-------------------------------------------------------------------------------------------')
