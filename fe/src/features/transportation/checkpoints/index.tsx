//path : fe/src/features/students/index.tsx
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CheckpointsDialogs } from '@/features/transportation/checkpoints/components/checkpoints-dialogs'
import { CheckpointsPrimaryButtons } from './components/checkpoints-primary-buttons'
import { CheckpointsTable } from './components/checkpoints-table'
import { columns } from './components/table/checkpoints-columns'
import CheckpointsProvider from './context/checkpoints-context'
import { checkpoints } from './data/checkpoints'
import { checkpointListSchema } from './data/schema'

export default function Checkpoints() {
  const checkpointList = checkpointListSchema.parse(checkpoints)
  return (
    <CheckpointsProvider>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Quản lý điểm dừng xe bus</h2>
            <p className='text-muted-foreground'>Quản lý các điểm dừng xe bus cho dịch vụ đưa đón học sinh.</p>
          </div>
          <CheckpointsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CheckpointsTable data={checkpointList} columns={columns} />
        </div>
      </Main>
      <CheckpointsDialogs />
    </CheckpointsProvider>
  )
}
