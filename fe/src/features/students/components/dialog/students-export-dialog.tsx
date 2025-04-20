// path : fe/src/features/students/components/dialog/students-export-dialog.tsx
import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Student } from '../../data/schema'

/**
 * We let the user choose an export format ("csv" or "json").
 * You can add more formats if desired.
 */
const formSchema = z.object({
  format: z.enum(['csv', 'json']),
})
type ExportFormValues = z.infer<typeof formSchema>

interface StudentsExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  students: Student[]
}

export function StudentsExportDialog({ open, onOpenChange, students }: StudentsExportDialogProps) {
  // ---------------------------
  // React Hook Form setup
  const form = useForm<ExportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { format: 'csv' },
  })

  // ---------------------------
  // Convert students data to CSV string
  // (Updated columns matching your new schema fields)
  function convertToCsv(data: Student[]): string {
    // You can adjust column order / naming as desired:
    const headers = ['id', 'rollNumber', 'name', 'dob', 'address', 'gender', 'status', 'parentName', 'parentPhone', 'checkpointName', 'checkpointDescription']

    const rows = data.map((s) => [
      s.id,
      s.rollNumber,
      s.name,
      // Convert ISO datetime to simple YYYY-MM-DD or keep full ISO
      new Date(s.dob).toISOString().substring(0, 10),
      s.address,
      s.gender,
      s.status,
      s.parentName,
      s.parentPhone,
      s.checkpointName,
      s.checkpointDescription,
    ])

    // Build the CSV file lines
    const csvContent = [
      headers.join(','), // header row
      ...rows.map((row) =>
        row
          // Escape quotes if needed
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n')

    return csvContent
  }

  // ---------------------------
  // Download a text file (e.g., CSV or JSON)
  function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    // Append the link, click it, remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Release the object URL
    URL.revokeObjectURL(url)
  }

  // ---------------------------
  // Handle form submission
  function handleExport(values: ExportFormValues) {
    if (!students || !students.length) {
      toast({ title: 'Không có dữ liệu để xuất!' })
      return
    }

    if (values.format === 'csv') {
      const csvData = convertToCsv(students)
      const filename = `students_${Date.now()}.csv`
      downloadFile(filename, csvData)
    } else if (values.format === 'json') {
      // Convert the students array to JSON
      const jsonData = JSON.stringify(students, null, 2)
      const filename = `students_${Date.now()}.json`
      downloadFile(filename, jsonData)
    }

    toast({
      title: 'Xuất dữ liệu thành công',
      description: `Đã xuất file dạng ${values.format.toUpperCase()}`,
    })
    onOpenChange(false)
  }

  // ---------------------------
  // Reset the form whenever we close the dialog
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  // ---------------------------
  // Render dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Xuất danh sách học sinh</DialogTitle>
          <DialogDescription>Chọn định dạng file xuất và nhấn nút “Xuất”.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='student-export-form' onSubmit={form.handleSubmit(handleExport)} className='space-y-4'>
            {/* Radio buttons to choose CSV or JSON */}
            <FormField
              control={form.control}
              name='format'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Định dạng</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value}>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='csv' id='csv' />
                        <label htmlFor='csv'>CSV</label>
                      </div>
                      <div className='mt-1 flex items-center space-x-2'>
                        <RadioGroupItem value='json' id='json' />
                        <label htmlFor='json'>JSON</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Hủy</Button>
          </DialogClose>
          <Button type='submit' form='student-export-form'>
            Xuất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
