import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook is working", req);

  try {
    const body = await req.json();
    console.log("Webhook triggered", body);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.log("Webhook processing error", error);

    return new NextResponse("Intenal Server Error", { status: 500 });
  }
}
