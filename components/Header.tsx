import { title } from "process";
import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-semibold mb-2 uppercase">{title}</h1>
      <p className="text-muted-foreground mb-6">{subtitle}</p>
    </>
  );
};

export default Header;
