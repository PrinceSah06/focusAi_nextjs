import React from 'react'

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title,description}:PageHeaderProps) => {
  return (
  <div className="space-y-1">
  <h1 className="text-3xl font-bold">{title}</h1>
  {description && (
    <p className="text-muted-foreground">{description}</p>
  )}
</div>
  )
}

export default PageHeader
