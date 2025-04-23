//path : fe/src/features/users/components/users-dialogs.tsx
import { useUsers } from '../context/users-context'
import { UsersAddDialog } from './dialog/users-add-dialog'
import { UsersDeleteDialog } from './dialog/users-delete-dialog'
import { UsersEditViewDialog } from './dialog/users-edit-view-dialog'
import { UsersImportDialog } from './dialog/users-import-excel-dialog'
import { UsersInviteDialog } from './dialog/users-invite-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  return (
    <>
      {/* <UsersActionDialog key='user-add' open={open === 'add'} onOpenChange={() => setOpen('add')} /> */}
      <UsersInviteDialog key='user-invite' open={open === 'invite'} onOpenChange={() => setOpen('invite')} />
      <UsersImportDialog key='user-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />
      <UsersAddDialog key='user-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />
      {currentRow && (
        <>
          <UsersEditViewDialog
            key={`user-edit-view-${currentRow.userId}`}
            open={open === 'view-edit-details'}
            onOpenChange={() => {
              setOpen('view-edit-details')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          <UsersDeleteDialog
            key={`user-delete-${currentRow.userId}`}
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
