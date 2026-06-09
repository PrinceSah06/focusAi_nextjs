import React from 'react'
import Nav from "@/src/componets/layout/Nav"
import Sidebar from "@/components/layout/sidebar"
import StartCard from '@/components/StartCard';
import TaskCard from '@/components/TaskCard';

const page = () => {
  return (
    <div>
        {/* <Nav/> */}
        {/* <Sidebar/> */}
      <StartCard value={18}title={'demots'}/>
      <TaskCard priority="HIGH"  status="COMPLETED" title="demo for task Card" deadline= "2 week"
      key={"demo"}/>
      
    </div>
  )
}

export default page
