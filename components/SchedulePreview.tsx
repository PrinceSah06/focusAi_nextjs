import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimeBlock } from "@/src/app/(dashboard)/demodata";

import React from "react";

const SchedulePreview = ({ end, energy, start, taskTitle }: TimeBlock) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl"> 🕘   {start} - {end}</CardTitle>
      </CardHeader>
      <CardContent>
       {taskTitle}
      </CardContent>

      <CardFooter>
      
        <p> 
🔋 Energy: {energy}</p>
      </CardFooter>

      
    </Card>
  );
};

export default SchedulePreview;
