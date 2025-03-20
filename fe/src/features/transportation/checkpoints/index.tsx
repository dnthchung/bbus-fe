import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CheckpointsDialogs } from '@/features/transportation/checkpoints/components/checkpoints-dialogs'
import { CheckpointsPrimaryButtons } from './components/checkpoints-primary-buttons'
import { CheckpointsTable } from './components/checkpoints-table'
import CreateCheckpointPage from './components/page/CreateCheckpointPage'
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
        <Tabs orientation='vertical' defaultValue='list' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='list'>Danh sách</TabsTrigger>
              <TabsTrigger value='create'>Tạo mới</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='list' className='space-y-4'>
            <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Quản lý điểm dừng xe bus</h2>
                <p className='text-muted-foreground'>Danh sách các điểm dừng xe bus cho dịch vụ đưa đón học sinh.</p>
              </div>
              <CheckpointsPrimaryButtons />
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <CheckpointsTable data={checkpointList} columns={columns} />
            </div>
            <CheckpointsDialogs />
          </TabsContent>
          {/* ====================================== */}
          <TabsContent value='create' className='space-y-4'>
            <div className='pb-4'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold tracking-tight'>Quản lý điểm dừng xe bus</h2>
                <p className='text-muted-foreground'>Tạo điểm dừng xe buýt mới</p>
              </div>
              <CreateCheckpointPage />
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </CheckpointsProvider>
  )
}
