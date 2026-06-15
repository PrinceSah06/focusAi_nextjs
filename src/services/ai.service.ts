import { date } from "zod";
import { prisma } from "../lib/prisma";
import type { GeneratedScheduleItem } from "@/src/types/index";

export const storeInSchedulDb = async (
  userId: string,
  data: GeneratedScheduleItem[],
) => {
  return prisma.schedule.create({
    data: {
      userId,
      blocks: data,
    },
  });
};
export const taskFromSchedulDB = async (userId :string)=>{
return prisma.schedule.findMany({
    where:{
        userId
    }
})
}

export const getUserSchedul = async (userId: string, date?: string) => {
  const startOfToday = date ? new Date(date) : new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endofToday = new Date(startOfToday);
  endofToday.setUTCDate(startOfToday.getUTCDate() + 1);

  const result = await prisma.schedule.findFirst({
    where: {
      userId: userId,
      date: {
        gte: startOfToday,
        lte: endofToday,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return result;
}
