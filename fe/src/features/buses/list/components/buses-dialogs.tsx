//path : fe/src/features/buses/components/buses-dialogs.tsx
import { useBuses } from '@/features/buses/context/buses-context'

export function BusesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBuses()

  return (
    <>
      {/* Optional: <BusesActionDialog ... /> nếu bạn muốn dùng dialog dạng tổng hợp */}
      {/* <BusesInviteDialog key='bus-invite' open={open === 'invite'} onOpenChange={() => setOpen('invite')} />
      <BusesImportDialog key='bus-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />
      <BusesAddDialog key='bus-add' open={open === 'add'} onOpenChange={() => setOpen('add')} /> */}

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
