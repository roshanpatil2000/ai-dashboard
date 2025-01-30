import { fetchModel } from "@/app/actions/model-actions";
import Header from "@/components/Header";
import React from "react";

const Models = async () => {
  const data = await fetchModel();
  return (
    <section>
      <Header
        title="My Models"
        subtitle="View and manage your trained models"
      />
    </section>
  );
};

export default Models;
