// views/FamilienView.tsx

import { Outlet } from 'react-router-dom'

export default function FamilienView() {
  return (
    <div className="flex flex-row gap-4 p-4 text-gray-200">
      <div className="flex-1 bg-white rounded p-4 text-black shadow">
        <Outlet />
      </div>
    </div>
  )
}