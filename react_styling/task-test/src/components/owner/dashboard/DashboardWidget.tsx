'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Suspense } from 'react'

export default function DashboardWidget({ widget }: { widget: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${widget.size === 'full' ? 'col-span-full' : 'col-span-1 md:col-span-2'}
        transition-all duration-300 group
      `}
    >
      <div className="relative">
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <Suspense fallback={<div>Chargement de {widget.title}...</div>}>
          <widget.component />
        </Suspense>
      </div>
    </div>
  )
}
