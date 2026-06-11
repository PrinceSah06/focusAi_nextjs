import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import type { Stat } from "@/src/app/(dashboard)/demodata";

const StartCard = ({ title, value, description }: Stat) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
};

export default StartCard;
