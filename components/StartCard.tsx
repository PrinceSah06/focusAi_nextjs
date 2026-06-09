import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
}

const StatsCard = ({ title, value, description }: StatsCardProps) => {
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

export default StatsCard;
