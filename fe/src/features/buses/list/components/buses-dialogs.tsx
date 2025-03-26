//path : fe/src/features/buses/components/buses-dialogs.tsx
import { useBuses } from '@/features/buses/context/buses-context'
// import { BusesActionDialog } from './dialog/buses-action-dialog'
// import { BusesAddDialog } from './dialog/buses-add-dialog'
// import { BusesDeleteDialog } from './dialog/buses-delete-dialog'
// import { BusesEditViewDialog } from './dialog/buses-edit-view-dialog' // bỏ vì dùng PageViewDetails
// import { BusesImportDialog } from './dialog/buses-import-excel-dialog'
// import { BusesInviteDialog } from './dialog/buses-invite-dialog'
import PageViewDetails from './page/page-view-details'

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
          {/* Sử dụng dialog hiển thị chi tiết riêng */}
          <PageViewDetails />

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
