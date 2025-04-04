const axios = require('axios');

const url = "https://sandbox.factura.com/api/v4/cfdi/list";

const payload = {
  month: "01",
  year: "2024",
  rfc: "WERX631016S30",
  page: 1,
  per_page: 15
};

const headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'JDJ5JDEwJEFNaDFlQmcyWmFWd05vWG05SEZlZmU2UC9QbnZ0YVJtbkdZNHlrTUlKTE1KZkFFMFZDVDJl',
  'F-Secret-Key': 'JDJ5JDEwJEExZGZuMGpzNXFHcmpGcWlrTGJXTWVqMWVrRksuclVzWWcuRzBoY3N1SjdmNjZBbVVpaHRp'
};

async function makeRequest() {
  try {
    const response = await axios.post(url, payload, { headers });
    
    console.log(`Status Code: ${response.status}`);
    console.log("\nResponse Headers:");
    console.log(JSON.stringify(response.headers, null, 2));
    console.log("\nResponse Body:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log(`Error Status: ${error.response.status}`);
      console.log("Error Response:", error.response.data);
    } else if (error.request) {
      console.log("Error en la solicitud:", error.message);
    } else {
      console.log("Error:", error.message);
    }
  }
}

makeRequest(); 