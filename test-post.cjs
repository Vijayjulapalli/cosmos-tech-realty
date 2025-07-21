// Use dynamic import for node-fetch (compatible with CommonJS)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Sample inquiry data
const inquiryData = {
  name: "Test User",
  email: "testuser@example.com",
  phone: "9876543210",
  buyOrRent: "Buy",
  houseType: "Independent House",
  area: "Hyderabad",
  zipCode: "500001",
  extraInput: "Looking for a 3BHK in Kukatpally."
};

fetch("http://localhost:8081/api/send-inquiry", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(inquiryData)
})
  .then(async (response) => {
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errMessage = isJson ? await response.json() : await response.text();
      throw new Error(`❌ Server responded with ${response.status}: ${JSON.stringify(errMessage)}`);
    }

    const data = isJson ? await response.json() : await response.text();
    console.log("✅ Success:", data);
  })
  .catch((error) => {
    console.error("❌ Error:", error.message);
  });

