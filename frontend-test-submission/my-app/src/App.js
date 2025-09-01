// inside App.js (React)
const handleRegister = async () => {
  try {
    const response = await fetch("https://your-api.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "ugcet2210064@reva.edu.in",
        name: "t s anjum kausar",
        rollNo: "r22eq035"
      })
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();

    // 🔹 Use the response here
    console.log("Registration successful:", data);

    // Example: store clientID and clientSecret for later use
    localStorage.setItem("clientID", data.clientID);
    localStorage.setItem("clientSecret", data.clientSecret);

  } catch (error) {
    console.error("Error:", error);
  }
};
