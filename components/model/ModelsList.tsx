"use client";
import { Database } from "@/database.types";
import React, { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { formatDistance } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Trash,
  Trash2,
  User2,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteModel } from "@/app/actions/model-actions";

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};
interface ModelsListProps {
  models: ModelType;
}
const ModelsList = ({ models }: ModelsListProps) => {
  const toastId = useId();
  const { data } = models;

  const handleDeleteModel = async (
    id: number,
    model_id: string,
    model_version: string
  ) => {
    toast.loading("Deleting the model...", { id: toastId });
    const { success, error } = await deleteModel(id, model_id, model_version);
    if (error) {
      toast.error(error, { id: toastId });
    }
    if (success) {
      toast.success("Model deleted successfully", { id: toastId });
    }
  };

  if (data?.length === 0) {
    return (
      <Card className="flex h-[450px] flex-col items-center justify-center text-center">
        <CardHeader>
          <CardTitle>No Models Found</CardTitle>
          <CardDescription>
            You have not trained models yet. Start bt creating new model
          </CardDescription>
          <Link href="/model-training" className="inline-block pt-2">
            <Button className="w-fit">Create New Model</Button>
          </Link>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((model) => (
        <Card key={model.id} className="relative flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{model.model_name}</CardTitle>
              <div className="flex items-center gap-2">
                {model.training_status === "succeeded" ? (
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <CheckCircle2 className="w-4 h-4 " />
                    <span className="capitalize">Ready</span>
                  </div>
                ) : model.training_status === "failed" ||
                  model.training_status === "canceled" ? (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <XCircle className="w-4 h-4 " />
                    <span className="capitalize">{model.training_status}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="capitalize">Training</span>
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="w-8 h-8 text-destructive/90 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 " />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Model?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this model? This action
                        cannot be undone. This will permanently delete this
                        modal data and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() =>
                          handleDeleteModel(
                            model.id,
                            model.model_id || "",
                            model.version || ""
                          )
                        }
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <CardDescription>
              created{" "}
              {formatDistance(new Date(model.created_at), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
            <Link href="/model-training" className="inline-block pt-2">
              <Button className="w-fit">Create New Model</Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1   p-3">
            <div className=" space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span> Training Duration</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {Math.round(Number(model.training_time) / 60) || NaN} Mins
                  </p>
                </div>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User2 className="w-4 h-4" />
                    <span> Gender</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {model.gender === "man" ? "Male" : "Female"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelsList;
