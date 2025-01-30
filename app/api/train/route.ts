import { supaebaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { error, log } from "console";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_URL =
  process.env.SITE_URL ?? "https://91f7-45-124-140-71.ngrok-free.app";
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

    // create modal first
    const modelId = `${user.id}_${Date.now()}_${input.modalName
      .toLowerCase()
      .replaceAll(" ", "_")}`;
    const hardwareList = await replicate.hardware.list();
    console.log(hardwareList);
    await replicate.models.create("roshanpatil2000", modelId, {
      visibility: "private",
      hardware: "cpu",
    });

    // start training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `roshanpatil2000/${modelId}`,
        input: {
          steps: 1200,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "ohwx",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training`,
        webhook_events_filter: ["completed"],
      }
    );
    // end training

    // add model values to supabase
    await supaebaseAdmin.from("models").insert({
      model_id: modelId,
      user_id: user.id,
      model_name: input.modalName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "ohwx",
      training_steps: 1200,
      training_id: training.id,
    });

    // console.log("training==>", training);

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
