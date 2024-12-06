const axios = require("axios");

async function main() {
  try {
    await axios.post("http://localhost:3000/api/user/migration", {
      method: "POST",
      headers: {
        "x-trpc-source": "client",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error occurred while calling tRPC endpoint:", error);
  }
}

main();
