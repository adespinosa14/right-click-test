import json

def Labor(job_type, level):
    with open("data/labor_rates.json", "r") as file:
        labor_data = json.load(file)

    for labor in labor_data:
        if labor.get('jobType') == job_type and labor.get('level') == level:
            return labor

    return None
