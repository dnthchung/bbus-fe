// path: fe/src/features/students/components/students-dialogs.tsx
import { useStudents } from '../../context/students-context'
// Example: If you're loading your students array from an API or other data file,
// import that here. Right now it references a local "students" array:
// import { students } from '../../data/students'
// Updated dialogs referencing new schema fields
import { StudentsAddDialog } from './students-add-dialog'
import { StudentsDeleteDialog } from './students-delete-dialog'
import { StudentsExportDialog } from './students-export-dialog'
import { StudentsImportDialog } from './students-import-excel-dialog'

// import { StudentsInviteDialog } from './students-invite-dialog'

export function StudentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStudents()

  return (
    <>
      {/* "Add" Dialog */}
      <StudentsAddDialog key='student-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {/* If you have an "Invite" dialog, you can uncomment this */}
      {/*
      <StudentsInviteDialog
        key="student-invite"
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />
      */}

      {/* "Import" Dialog */}
      <StudentsImportDialog key='student-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />

      {/*
       * "Export" Dialog could be shown whether or not we have a currentRow,
       * but in your code snippet you show it inside the condition below.
       * If you'd like it always available, move it out here.
       */}

      {/* Conditionally render these dialogs if we have a selected row */}
      {currentRow && (
        <>
          {/* "Edit" Dialog */}
          <StudentsAddDialog
            key={`student-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              // Reset current row after closing
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          {/* "Export" Dialog: pass in all students or a subset as needed */}
          {/* <StudentsExportDialog key='student-export' open={open === 'export'} onOpenChange={() => setOpen('export')} students={students} /> */}

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
