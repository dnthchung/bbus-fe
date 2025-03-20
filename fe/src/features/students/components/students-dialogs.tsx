// path: fe/src/features/students/components/students-dialogs.tsx
import { useStudents } from '../context/students-context'
// Example: If you're loading your students array from an API or other data file,
// import that here. Right now it references a local "students" array:
// import { students } from '../../data/students'
// Updated dialogs referencing new schema fields
import { StudentsAddDialog } from './dialog/students-add-dialog'
import { StudentsDeleteDialog } from './dialog/students-delete-dialog'
import { StudentsEditViewDialog } from './dialog/students-edit-view-dialog'
import { StudentsImportDialog } from './dialog/students-import-excel-dialog'

// import { StudentsInviteDialog } from './students-invite-dialog'

export function StudentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStudents()

  return (
    <>
      {/* "Add" Dialog */}
      <StudentsAddDialog key='student-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />
      {/* "Import" Dialog */}
      <StudentsImportDialog key='student-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />

      {/* Conditionally render these dialogs if we have a selected row */}
      {currentRow && (
        <>
          {/* "Edit" Dialog */}
          <StudentsEditViewDialog
            key={`student-edit-${currentRow.id}`}
            open={open === 'edit-view'}
            onOpenChange={() => {
              setOpen('edit-view')
              // Reset current row after closing
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          {/* "Delete" Dialog */}
          <StudentsDeleteDialog
            key={`student-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              // Reset current row after closing
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
