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