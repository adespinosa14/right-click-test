import json

def Customers():
    with open("data/customers.json", "r") as file:
        data = json.load(file)
    
    print(data)