import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NextResponse } from "next/server";

export async function getUser(id: number) {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/accounts/users/${id}/`
    );

    if (response.status == 200) {
      return response.data;
    }
  } catch (e) {
    console.error("Error", e);
    return null;
  }
}
