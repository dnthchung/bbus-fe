//path : fe/src/features/buses/components/buses-dialogs.tsx
import { useBuses } from '@/features/buses/context/buses-context'
import { BusesAddDialog } from '@/features/buses/list/components/dialog/buses-add-dialog'
import { BusesEditCapacityDialog } from '@/features/buses/list/components/dialog/buses-edit-capacity'
import { BusImportDialog } from '@/features/buses/list/components/dialog/buses-import-excel-dialog'
import { BusesUploadStudentToCamera } from '@/features/buses/list/components/dialog/buses-upload-student-to-camera'

export function BusesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBuses()

  return (
    <>
      {/* Optional: <BusesActionDialog ... /> nếu bạn muốn dùng dialog dạng tổng hợp */}
      <BusImportDialog key='bus-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />
      <BusesAddDialog key='bus-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />
      <BusesUploadStudentToCamera key='bus-upload-student' open={open === 'upload-student-to-camera'} onOpenChange={() => setOpen('upload-student-to-camera')} />
      {/* <BusesEditDialog key='bus-edit' open={open === 'edit'} onOpenChange={() => setOpen('edit')} /> */}
      {/* <BusesViewEditDetailsDialog key='bus-view-edit-details' open={open === 'view-edit-details'} onOpenChange={() => setOpen('view-edit-details')} /> */}
      <BusesEditCapacityDialog
        key='bus-edit-capacity'
        open={open === 'change-student-capacity'}
        onOpenChange={() => setOpen('change-student-capacity')}
        onSubmit={function (value: number): void {
          throw new Error('Function not implemented.')
        }}
      />
      {/* trong table , phần option */}

      {currentRow && (
        <>
          {/* <BusesDeleteDialog
            key={`bus-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          /> */}
        </>
      )}
    </>
  )
}
