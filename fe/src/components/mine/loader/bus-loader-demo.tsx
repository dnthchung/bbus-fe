'use client'

//file url : fe/src/components/mine/loader/bus-loader-demo.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BusLoader } from './bus-loader'

export const BusLoaderDemo = () => {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'>('md')
  const [variant, setVariant] = useState<'primary' | 'secondary' | 'default'>('default')
  const [showText, setShowText] = useState(true)
  const [text, setText] = useState('Loading...')
  const [showFullScreen, setShowFullScreen] = useState(false)

  return (
    <div className='container py-10'>
      <h1 className='mb-6 text-3xl font-bold'>Bus Loader Component</h1>

      <Tabs defaultValue='preview' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='preview'>Preview</TabsTrigger>
          <TabsTrigger value='config'>Configuration</TabsTrigger>
          <TabsTrigger value='usage'>Usage Examples</TabsTrigger>
        </TabsList>

        <TabsContent value='preview' className='space-y-4'>
          <Card className='flex min-h-[300px] items-center justify-center p-6'>{showFullScreen && size === 'full' ? <BusLoader size='full' variant={variant} showText={showText} text={text} /> : <BusLoader size={size} variant={variant} showText={showText} text={text} />}</Card>

          {size === 'full' && (
            <div className='flex justify-center'>
              <Button onClick={() => setShowFullScreen(!showFullScreen)} variant='outline'>
                {showFullScreen ? 'Hide' : 'Show'} Full Screen Loader
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value='config' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='size'>Size</Label>
                <Select value={size} onValueChange={(value: any) => setSize(value)}>
                  <SelectTrigger id='size'>
                    <SelectValue placeholder='Select size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='sm'>Small (sm)</SelectItem>
                    <SelectItem value='md'>Medium (md)</SelectItem>
                    <SelectItem value='lg'>Large (lg)</SelectItem>
                    <SelectItem value='xl'>Extra Large (xl)</SelectItem>
                    <SelectItem value='2xl'>Double Extra Large (2xl)</SelectItem>
                    <SelectItem value='full'>Full Screen (full)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='variant'>Variant</Label>
                <Select value={variant} onValueChange={(value: any) => setVariant(value)}>
                  <SelectTrigger id='variant'>
                    <SelectValue placeholder='Select variant' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='default'>Default</SelectItem>
                    <SelectItem value='primary'>Primary</SelectItem>
                    <SelectItem value='secondary'>Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Switch id='show-text' checked={showText} onCheckedChange={setShowText} />
                <Label htmlFor='show-text'>Show Text</Label>
              </div>

              {showText && (
                <div>
                  <Label htmlFor='text'>Custom Text</Label>
                  <Input id='text' value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter custom loading text' />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='usage' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card className='space-y-4 p-6'>
              <h3 className='text-lg font-medium'>Component Loading</h3>
              <div className='flex h-[200px] items-center justify-center rounded-md border'>
                <BusLoader size='sm' text='Loading data...' />
              </div>
              <div className='rounded-md bg-muted p-3'>
                <pre className='overflow-auto text-xs'>{`<BusLoader size="sm" text="Loading data..." />`}</pre>
              </div>
            </Card>

            <Card className='space-y-4 p-6'>
              <h3 className='text-lg font-medium'>Table Loading</h3>
              <div className='flex h-[200px] items-center justify-center rounded-md border'>
                <BusLoader size='md' text='Loading table...' variant='primary' />
              </div>
              <div className='rounded-md bg-muted p-3'>
                <pre className='overflow-auto text-xs'>{`<BusLoader size="md" text="Loading table..." variant="primary" />`}</pre>
              </div>
            </Card>

            <Card className='space-y-4 p-6'>
              <h3 className='text-lg font-medium'>Page Section Loading</h3>
              <div className='flex h-[200px] items-center justify-center rounded-md border'>
                <BusLoader size='lg' variant='secondary' />
              </div>
              <div className='rounded-md bg-muted p-3'>
                <pre className='overflow-auto text-xs'>{`<BusLoader size="lg" variant="secondary" />`}</pre>
              </div>
            </Card>

            <Card className='space-y-4 p-6'>
              <h3 className='text-lg font-medium'>Full Page Loading</h3>
              <div className='relative flex h-[200px] items-center justify-center rounded-md border'>
                <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
                  <BusLoader size='xl' text='Loading page...' />
                </div>
              </div>
              <div className='rounded-md bg-muted p-3'>
                <pre className='overflow-auto text-xs'>{`<BusLoader size="full" text="Loading page..." />`}</pre>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
