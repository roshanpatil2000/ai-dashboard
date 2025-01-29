import Header from "@/components/Header";
import ModelTrainingForm from "@/components/model/ModelTrainingForm";
import React from "react";

const ModelTraining = () => {
  return (
    <section className="container mx-auto`">
      {/* <h1 className="text-3xl font-semibold mb-2 uppercase">Train Model</h1>
      <p className="text-muted-foreground mb-6">
        Train a new model with your own images
      </p> */}
      <Header
        title="Train Model"
        subtitle="Train a new model with your own images"
      />
      <ModelTrainingForm />
    </section>
  );
};

export default ModelTraining;
