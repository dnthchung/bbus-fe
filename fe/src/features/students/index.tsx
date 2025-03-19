// // path : fe/src/features/students/index.tsx
// import { useEffect, useState } from 'react'
// import { ProfileDropdown } from '@/components/common/profile-dropdown'
// import { ThemeSwitch } from '@/components/common/theme-switch'
// import { Header } from '@/components/layout/header'
// import { Main } from '@/components/layout/main'
// import { StudentsDialogs } from '@/features/students/components/dialog/students-dialogs'
// import { StudentsPrimaryButtons } from '@/features/students/components/students-primary-buttons'
// import { StudentsTable } from '@/features/students/components/students-table'
// import { columns } from './components/table/students-columns'
// import StudentsProvider from './context/students-context'
// import { Student } from './data/schema'
// // Import the function that calls your API
// import { getAllStudents } from './data/students'
// export default function Students() {
//   // 1) Keep local state for your list of students
//   const [studentList, setStudentList] = useState<Student[]>([])
//   // 2) Fetch students on mount, parse & store in state
//   useEffect(() => {
//     async function fetchStudents() {
//       try {
//         const parsedStudents = await getAllStudents()
//         console.log('Parsed students:', parsedStudents)
//         setStudentList(parsedStudents)
//       } catch (error) {
//         console.error('Error fetching students in index.tsx:', error)
//       }
//     }
//     fetchStudents()
//   }, [])
//   // 3) Render
//   return (
//     <StudentsProvider>
//       <Header fixed>
//         {/* Any other icons/elements here */}
//         <div className='ml-auto flex items-center space-x-4'>
//           <ThemeSwitch />
//           <ProfileDropdown />
//         </div>
//       </Header>
//       <Main>
//         <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
//           <div>
//             <h2 className='text-2xl font-bold tracking-tight'>DS học sinh</h2>
//             <p className='text-muted-foreground'>Quản lý thông tin học sinh đăng ký sử dụng dịch vụ xe bus.</p>
//           </div>
//           <StudentsPrimaryButtons />
//         </div>
//         <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
//           {/* Pass the fetched studentList and your columns to the table */}
//           <StudentsTable data={studentList} columns={columns} />
//         </div>
//       </Main>
//       {/* Include modals/dialogs that interact with the table */}
//       <StudentsDialogs />
//     </StudentsProvider>
//   )
// }
// path : fe/src/features/students/index.tsx
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StudentsDialogs } from '@/features/students/components/dialog/students-dialogs'
import { StudentsPrimaryButtons } from '@/features/students/components/students-primary-buttons'
import { StudentsTable } from '@/features/students/components/students-table'
import { columns } from './components/table/students-columns'
import StudentsProvider, { useStudents } from './context/students-context'

function StudentsContent() {
  const { students, loading } = useStudents()

  return (
    <>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>DS học sinh</h2>
            <p className='text-muted-foreground'>Quản lý thông tin học sinh đăng ký sử dụng dịch vụ xe bus.</p>
          </div>
          <StudentsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>{loading ? <div className='flex justify-center p-8'>Đang tải...</div> : <StudentsTable data={students} columns={columns} />}</div>
      </Main>
      <StudentsDialogs />
    </>
  )
}

export default function Students() {
  return (
    <StudentsProvider>
      <StudentsContent />
    </StudentsProvider>
  )
}
