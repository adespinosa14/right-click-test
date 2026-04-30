import json

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

def Equipment(equipment_types):

    with open('data/equipment.json', 'r') as file:
        equipment_data = json.load(file)


    buckets = {category: [] for category in equipment_types}
    
    for equipment in equipment_data:
        category = equipment.get('category', 'N/A')

        if category in buckets:
            buckets[category].append(equipment)

    return buckets


def Labor():
    with open("data/labor_rates.json", "r") as file:
        labor_data = json.load(file)

        for labor in labor_data:
            job_type = labor.get('jobType', 'N/A')
            level = labor.get('level', 'N/A')
            hourly = labor.get('hourlyRate', 'N/A')
            hours = labor.get('estimatedHours', 'N/A')

            print(f'\nJob: {job_type}\nLevel: {level}\nHourly: ${hourly}/hr\nTime: {hours} hours\n')
            print('\n-------------------------------------------------------------------------------------------')

def Category_Parser(category:str):

    types = category.replace(' + ', ',').replace(' - ', ',').split(',')
    all_types = []

    for type in types:
        if 'Air Conditioner' in type or 'AC' in type:
            all_types.append('Air Conditioner')
            continue

        if 'Heat Pump' in type:
            all_types.append('Heat Pump')
            continue
        
        if 'Furnace' in type:
            all_types.append('Furnace')
            continue
        
        if 'Mini-Split' in type:
            all_types.append('Mini-Split')
            continue
        
        if 'Air Handler' in type:
            all_types.append('Air Handler')
            continue

        if 'Rooftop Unit' in type:
            all_types.append('Rooftop Unit')
            continue
        
        if 'Compressor' in type:
            all_types.append('Compressor')
            continue

        if 'Motor' in type:
            all_types.append('Motor')
            continue
            
        if 'Coil' in type:
            all_types.append('Coil')
            continue

        if 'Thermostat' in type:
            all_types.append('Thermostat')
            continue

        if 'Capacitor' in type:
            all_types.append('Capacitor')
            continue

        if 'Gas Valve' in type:
            all_types.append('Gas Valve')
            continue

        if 'Control Board' in type:
            all_types.append('Control Board')
            continue
        
        if 'Ignitor' in type:
            all_types.append('Ignitor')
            continue

        if 'Humidifier' in type:
            all_types.append('Humidifier')
            continue

        if 'Air Cleaner' in type:
            all_types.append('Air Cleaner')
            continue

        if 'Air Purifier' in type:
            all_types.append('Air Purifier')
            continue

    return all_types