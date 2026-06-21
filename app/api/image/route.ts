import { NextRequest, NextResponse } from "next/server";

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=300&width=300";

export async function GET(req: NextRequest) {
  try {
    const target = req.nextUrl.searchParams.get("q");

    if (!target) {
      return NextResponse.json({
        success: false,
        image: PLACEHOLDER_IMAGE,
        error: "Missing q",
      });
    }

    const scraperBaseUrl = process.env.IMAGE_SCRAPER_URL;

    if (!scraperBaseUrl) {
      return NextResponse.json({
        success: false,
        image: PLACEHOLDER_IMAGE,
        error: "IMAGE_SCRAPER_URL is not defined",
      });
    }

    const scraperUrl = new URL("/url", scraperBaseUrl);
    scraperUrl.searchParams.set("q", target);

    const res = await fetch(scraperUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        image: PLACEHOLDER_IMAGE,
        status: res.status,
      });
    }

    const result = await res.json();

    return NextResponse.json({
      success: true,
      image: result && result?.image_url ? result.image_url : PLACEHOLDER_IMAGE,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      image: PLACEHOLDER_IMAGE,
      error: error.message,
    });
  }
}
