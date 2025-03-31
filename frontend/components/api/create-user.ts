import { Investment } from "@/app/invest/page";
import axios from "axios";

export async function createUser(investmentData: Investment) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/investment/create/",
      investmentData
    );

    if (response.status >= 200 && response.status < 300) {
      console.log("Investment created successfully:", response.data);
      return response.data; // Return the generated plan
    } else {
      console.error("Failed to create investment plan.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
