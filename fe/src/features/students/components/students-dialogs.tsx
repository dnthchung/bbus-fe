// path: fe/src/features/students/components/students-dialogs.tsx
import { useStudents } from '../context/students-context'
import { StudentsAddDialog } from './dialog/students-add-dialog'
import { StudentsDeleteDialog } from './dialog/students-delete-dialog'
import { StudentsImportDialog } from './dialog/students-import-excel-dialog'

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
