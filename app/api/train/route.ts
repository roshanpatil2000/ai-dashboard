import { supaebaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("The Replicate api token is not set");
    }
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "unauthorized",
        },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    const input = {
      filekey: formData.get("filekey") as string,
      modalName: formData.get("modalName") as string,
      gender: formData.get("gender") as string,
    };

    if (!input.filekey || !input.modalName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileName = input.filekey.replace("training_data/", "");
    const { data: fileUrl } = await supaebaseAdmin.storage
      .from("training_data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      throw new Error("Failed to fetch file url");
    }
    console.log(fileUrl);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Training Error:", error);
    const errorResponse =
      error instanceof Error
        ? error.message
        : "Failed to start the model training";
    return NextResponse.json({ error: errorResponse }, { status: 500 });
  }
}
