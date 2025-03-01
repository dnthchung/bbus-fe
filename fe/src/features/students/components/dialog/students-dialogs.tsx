//path : fe/src/features/users/components/users-dialogs.tsx
import { useStudents } from '../../context/students-context'
import { StudentsAddDialog } from './students-add-dialog'
import { StudentsDeleteDialog } from './students-delete-dialog'
import { StudentsImportDialog } from './students-import-excel-dialog'

// import { StudentsInviteDialog } from './students-invite-dialog'

export function StudentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStudents()

  return (
    <>
      <StudentsAddDialog key='student-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />
      {/* <StudentsInviteDialog key='student-invite' open={open === 'invite'} onOpenChange={() => setOpen('invite')} /> */}
      <StudentsImportDialog key='student-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />

      {currentRow && (
        <>
          <StudentsAddDialog
            key={`student-edit-${currentRow.studentId}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <StudentsDeleteDialog
            key={`student-delete-${currentRow.studentId}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
