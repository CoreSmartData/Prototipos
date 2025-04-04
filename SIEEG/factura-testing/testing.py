import requests
import json

url = "https://sandbox.factura.com/api/v4/cfdi/list"

payload = json.dumps({
  "month": "01",
  "year": "2024",
  "rfc": "WERX631016S30",
  "page": 1,
  "per_page": 15
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'JDJ5JDEwJEFNaDFlQmcyWmFWd05vWG05SEZlZmU2UC9QbnZ0YVJtbkdZNHlrTUlKTE1KZkFFMFZDVDJl',
  'F-Secret-Key': 'JDJ5JDEwJEExZGZuMGpzNXFHcmpGcWlrTGJXTWVqMWVrRksuclVzWWcuRzBoY3N1SjdmNjZBbVVpaHRp'
}

try:
    response = requests.request("POST", url, headers=headers, data=payload)
    print(f"Status Code: {response.status_code}")
    print("\nResponse Headers:")
    print(json.dumps(dict(response.headers), indent=2))
    print("\nResponse Body:")
    print(json.dumps(response.json(), indent=2) if response.text else "No response body")
except requests.exceptions.RequestException as e:
    print(f"Error en la solicitud: {e}")
except json.JSONDecodeError:
    print("Error al decodificar la respuesta JSON")
    print("Respuesta raw:", response.text)

