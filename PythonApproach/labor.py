import json
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