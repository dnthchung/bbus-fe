import { useCheckpoints } from '../context/checkpoints-context'
import { CheckpointsActionDialog } from './dialog/checkpoints-action-dialog'
import { CheckpointsDeleteDialog } from './dialog/checkpoints-delete-dialog'
import { CheckpointsImportDialog } from './dialog/checkpoints-import-excel-dialog'

export function CheckpointsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCheckpoints()

  return (
    <>
      {/* Dialog thêm điểm dừng */}
      <CheckpointsActionDialog key='checkpoint-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {/* Dialog nhập dữ liệu từ Excel */}
      <CheckpointsImportDialog key='checkpoint-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />

      {currentRow && (
        <>
          {/* Dialog chỉnh sửa điểm dừng */}
          <CheckpointsActionDialog
            key={`checkpoint-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          {/* Dialog xóa điểm dừng */}
          <CheckpointsDeleteDialog
            key={`checkpoint-delete-${currentRow.id}`}
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
