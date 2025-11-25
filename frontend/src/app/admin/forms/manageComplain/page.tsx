import React, { Suspense } from 'react'
import ManageComplain from '@/components/admin/forms/ManageComplain'

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ManageComplain />
      </Suspense>
    </div>
  )
}

export default page
