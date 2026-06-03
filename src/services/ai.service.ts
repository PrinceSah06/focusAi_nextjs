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
