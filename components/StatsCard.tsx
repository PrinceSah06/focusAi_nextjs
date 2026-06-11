import React from 'react'
import {Card,CardDescription,CardHeader,CardTitle,CardContent} from '@/components/ui/card'
import type { Stat } from '@/src/app/(dashboard)/demodata'

const StatsCard = ({title,value,description,}:Stat) => {
  return (
     <Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    {description && <CardDescription>{description}</CardDescription>}
  </CardHeader>

  <CardContent>
    <div className="flex gap-2">
       <h1 className="text-3xl font-bold">{value}</h1>
    </div>
  </CardContent>
</Card>
  )
}

export default StatsCard
