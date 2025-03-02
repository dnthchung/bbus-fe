//path : fe/src/features/students/components/data-table-row-actions.tsx
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useStudents } from '../../context/students-context'
import { Student } from '../../data/schema'

interface DataTableRowActionsProps {
  row: Row<Student>
}

export function StudentsDataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useStudents()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-[160px]'>
          {/* Edit Student */}
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('edit')
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete Student */}
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            className='!text-red-500'
          >
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
