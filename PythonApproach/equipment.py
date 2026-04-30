import json

def Equipment(equipment_types):

    with open('data/equipment.json', 'r') as file:
        equipment_data = json.load(file)


    buckets = {category: [] for category in equipment_types}
    
    for equipment in equipment_data:
        category = equipment.get('category', 'N/A')

        if category in buckets:
            buckets[category].append(equipment)

    return buckets