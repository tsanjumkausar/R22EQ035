import requests
import json

def register():
    url = "http://20.244.56.144/evaluation-service/register"
    headers = {"Content-Type": "application/json"}
    data = {
        "email": "ugcet2210064@reva.edu.in",
        "name": "T S ANJUM KAUSAR",
        "mobileNo": "9731093940",
        "githubUsername": "tsanjumkausar",
        "rollNo": "R22EQ035",
        "accessCode": "NJMKDW"
    }

    response = requests.post(url, json=data, headers=headers)
    print("Status Code:", response.status_code)
    try:
        creds = response.json()
        print("Response:", creds)

       
        with open("credentials.json", "w") as f:
            json.dump(creds, f, indent=2)
    except Exception as e:
        print("Error parsing response:", e)
        print("Raw Response:", response.text)


if __name__ == "__main__":
    register()
