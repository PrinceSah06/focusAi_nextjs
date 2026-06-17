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
export const taskFromSchedulDB = async (userId: string) => {
  return prisma.schedule.findMany({
    where: {
      userId,
    },
  });
};

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
        lt: endofToday,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return result;
};

 export const incrementAiCount = async (userId: string) => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const todayLog = await prisma.dailyLog.findFirst({
    where: {
      userId,
      date: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  if (todayLog) {
    const result = await prisma.dailyLog.update({
      where: {
        id: todayLog.id,
      },
      data: {
        aiCallsUsed: {
          increment: 1,
        },
      },
    });

    return result
  }

  return await prisma.dailyLog.create({ data: { userId, aiCallsUsed: 1 } });
};


export const getTodayLog = async (userId:string)=>{
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const todayLog = await prisma.dailyLog.findFirst({
    where: {
      userId,
      date: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  return todayLog

}




