import { NextResponse } from "next/server";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";

export async function GET() {
  try {
    const accessToken = await getHumeAccessToken();
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Failed to get Hume access token:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}