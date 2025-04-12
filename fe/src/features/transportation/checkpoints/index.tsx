import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDropdown } from '@/components/common/profile-dropdown'
import { ThemeSwitch } from '@/components/common/theme-switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { CheckpointsDialogs } from '@/features/transportation/checkpoints/components/checkpoints-dialogs'
import { CheckpointsPrimaryButtons } from './components/checkpoints-primary-buttons'
import { CheckpointsTable } from './components/checkpoints-table'
import CreateCheckpointPage from './components/page/create-checkpoint-page'
import { columns } from './components/table/checkpoints-columns'
import CheckpointsProvider, { useCheckpoints } from './context/checkpoints-context'
import { getAllCheckpoints } from './data/checkpoints'
import { Checkpoint } from './data/schema'

// Separate content component that uses the context
function CheckpointsContent() {
  const [checkpointList, setCheckpointList] = useState<Checkpoint[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch checkpoints on mount
  useEffect(() => {
    async function fetchCheckpoints() {
      try {
        setLoading(true)
        const parsedCheckpoints = await getAllCheckpoints()
        setCheckpointList(parsedCheckpoints)
      } catch (error) {
        console.error('Error fetching checkpoints in index.tsx:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCheckpoints()
  }, [])

  return (
    <>
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
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>{loading ? <div className='flex justify-center p-8'>Đang tải...</div> : <CheckpointsTable data={checkpointList} columns={columns} />}</div>
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
      <CheckpointsDialogs />
    </>
  )
}

// Main component that wraps the content with the provider
export default function Checkpoints() {
  return (
    <CheckpointsProvider>
      <CheckpointsContent />
    </CheckpointsProvider>
  )
}
