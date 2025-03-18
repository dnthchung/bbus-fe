//path : fe/src/features/users/components/users-dialogs.tsx
import { useUsers } from '../context/users-context'
import { UsersActionDialog } from './dialog/users-action-dialog'
import { UsersDeleteDialog } from './dialog/users-delete-dialog'
import { UsersEditViewDialog } from './dialog/users-edit-view-dialog'
import { UsersImportDialog } from './dialog/users-import-excel-dialog'
import { UsersInviteDialog } from './dialog/users-invite-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()

  return (
    <>
      <UsersActionDialog key='user-add' open={open === 'add'} onOpenChange={() => setOpen('add')} />
      <UsersInviteDialog key='user-invite' open={open === 'invite'} onOpenChange={() => setOpen('invite')} />
      <UsersImportDialog key='user-import' open={open === 'import'} onOpenChange={() => setOpen('import')} />
      <UsersEditViewDialog key='user-view-edit-details' open={open === 'view-edit-details'} onOpenChange={() => setOpen('view-edit-details')} />
      {currentRow && (
        <>
          <UsersEditViewDialog
            key={`user-edit-view-${currentRow.id}`}
            open={open === 'view-edit-details'}
            onOpenChange={() => {
              setOpen('view-edit-details')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          {/* Commented out because "edit" functionality is now handled by "edit-view" */}
          {/* <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          /> */}
          <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
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
