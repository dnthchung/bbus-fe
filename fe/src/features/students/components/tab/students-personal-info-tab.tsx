'use client'

/*  STUDENTS PERSONAL-INFO TAB
    ──────────────────────────
    – Fully schema-driven validation (Zod + react-hook-form)
    – Inline error messages
    – Vietnamese toast notifications
    – Avatar upload with preview
*/
import { useState, useEffect, type ChangeEvent } from 'react'
import { z } from 'zod'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trimValue, isNotEmpty, validateInput } from '@/helpers/validations'
import { API_SERVICES } from '@/api/api-services'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/mine/badge'
import { AdvancedBusLoader } from '@/components/mine/loader/advanced-bus-loader'
import { Status } from '@/components/mine/status'
import { genderLabels, statusLabels } from '@/features/students/data/data'
import type { Student } from '@/features/students/data/schema'

/* ──────────────────────────────────────────────────────────── */
/*  CONSTANTS & HELPERS                                         */
/* ──────────────────────────────────────────────────────────── */

const MIN_DOB = '1950-01-01'
const MAX_DOB = new Date().toISOString().split('T')[0]

/** Chuyển message backend (EN) sang tiếng Việt. */
function parseUserCreationError(message: string): string {
  const parts = message.split(',').map((p) => p.trim())
  const friendly = parts.map((p) => {
    let m = p.match(/phone:\s*(\d+)/i)
    if (m) return `Số điện thoại ${m[1]} đã tồn tại`
    m = p.match(/email:\s*([^\s]+)/i)
    if (m) return `Email ${m[1]} đã tồn tại`
    return p
  })
  return friendly.join('. ')
}

/* ──────────────────────────────────────────────────────────── */
/*  ZOD SCHEMA                                                  */
/* ──────────────────────────────────────────────────────────── */

export const studentUpdateSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'Vui lòng nhập họ và tên')
    .transform(trimValue)
    .refine(isNotEmpty, 'Vui lòng nhập họ và tên')
    .refine((v) => /^[A-Za-zÀ-ỹ\s]+$/u.test(v), 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'),
  dob: z
    .preprocess(
      (v) => (v === '' || v == null ? undefined : v),
      z
        .date({
          required_error: 'Ngày sinh không được để trống',
          invalid_type_error: 'Ngày sinh không hợp lệ',
        })
        .refine((d) => d >= new Date(MIN_DOB) && d <= new Date(MAX_DOB), `Ngày sinh phải từ ${MIN_DOB} đến ${MAX_DOB}`)
    )
    .optional(),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ').transform(trimValue),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Giới tính không hợp lệ' }),
  }),
  className: z.string().regex(/^[1-5][A-D]$/, 'Lớp phải ở định dạng 1-5 + A-D (VD: "3B")'),
})

type StudentForm = z.infer<typeof studentUpdateSchema>

/* ──────────────────────────────────────────────────────────── */
/*  COMPONENT                                                   */
/* ──────────────────────────────────────────────────────────── */

interface Props {
  student: Student
  onStudentUpdate: (s: Student) => void
  /** `date` → `dd/MM/yyyy` or similar */
  formatDate: (d: Date | string | undefined) => string
}

export function StudentsPersonalInfoTab({ student, onStudentUpdate, formatDate }: Props) {
  /* ───────── REACT-HOOK-FORM ───────── */
  const methods = useForm<StudentForm>({
    resolver: zodResolver(studentUpdateSchema),
    defaultValues: {
      id: student.id,
      name: student.name ?? '',
      dob: student.dob ? new Date(student.dob) : undefined,
      address: student.address ?? '',
      gender: student.gender ?? 'MALE',
      className: student.className ?? '1A',
    },
    mode: 'onBlur',
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods

  /* ───────── LOCAL STATE (avatar + loaders) ───────── */
  const [editing, setEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(student.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* keep form in sync when parent switches student */
  useEffect(() => {
    reset({
      id: student.id,
      name: student.name ?? '',
      dob: student.dob ? new Date(student.dob) : undefined,
      address: student.address ?? '',
      gender: student.gender ?? 'MALE',
      className: student.className ?? '1A',
    })
    setAvatarPreview(student.avatar || null)
  }, [student, reset])

  /* ─────────── CLASS NAME DERIVED PARTS ─────────── */
  const gradeOptions = ['1', '2', '3', '4', '5']
  const classLetterOptions = ['A', 'B', 'C', 'D']

  const className = watch('className')
  const currentGrade = className[0] as string
  const currentClassLetter = className[1] as string

  const updateClassName = (part: 'grade' | 'letter', value: string) => {
    const next = part === 'grade' ? value + currentClassLetter : currentGrade + value
    setValue('className', next, { shouldValidate: true })
  }

  /* ─────────── SUBMIT HANDLER ─────────── */
  const onSubmit = async (data: StudentForm) => {
    try {
      setIsLoading(true)
      const updated = { ...student, ...data }
      await API_SERVICES.students.update(updated)
      onStudentUpdate(updated)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin cá nhân',
        variant: 'success',
      })
      setEditing(false)
    } catch (err: any) {
      toast({
        title: 'Không thể cập nhật thông tin',
        description: 'Đã xảy ra lỗi khi cập nhật thông tin. ' + parseUserCreationError(err?.message || ''),
        variant: 'deny',
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* ─────────── AVATAR ─────────── */
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      toast({
        title: 'File không hợp lệ',
        description: 'Vui lòng chọn ảnh hợp lệ (.jpg, .png, ...)',
        variant: 'destructive',
      })
    }
  }

  const handleAvatarCancel = () => {
    setAvatarFile(null)
    setAvatarPreview(student.avatar || null)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return
    try {
      setUploadingAvatar(true)
      const res = await API_SERVICES.students.updateAvatar(student.id, avatarFile)
      const newAvatar = res?.data?.data?.avatar || student.avatar
      onStudentUpdate({ ...student, avatar: newAvatar })
      toast({
        title: 'Thành công',
        description: 'Ảnh đại diện đã được cập nhật',
        variant: 'success',
      })
      setAvatarFile(null)
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật ảnh đại diện',
        variant: 'destructive',
      })
    } finally {
      setUploadingAvatar(false)
    }
  }

  /* ─────────── RENDER ─────────── */
  return (
    <>
      {isLoading && <AdvancedBusLoader size='full' variant='primary' animation='drive' text='Đang cập nhật thông tin...' />}

      <FormProvider {...methods}>
        <form id='student-form' onSubmit={handleSubmit(onSubmit)} className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* LEFT: Personal info */}
          <div className='space-y-1 md:col-span-2'>
            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-medium'>Thông tin cá nhân</h3>
              {editing ? (
                <div className='space-x-2'>
                  <Button variant='outline' size='sm' onClick={() => setEditing(false)} type='button'>
                    Hủy
                  </Button>
                  <Button size='sm' type='submit'>
                    Lưu
                  </Button>
                </div>
              ) : (
                <Button variant='outline' size='sm' onClick={() => setEditing(true)} type='button'>
                  Chỉnh sửa
                </Button>
              )}
            </div>

            <div className='overflow-hidden rounded-md border text-sm'>
              {/* Name */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Họ và tên</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <>
                      <Controller control={control} name='name' render={({ field }) => <Input {...field} onChange={(e) => field.onChange(e.target.value.replace(/^\s+/, ''))} className={`h-8 ${errors.name ? 'border-red-500' : ''}`} />} />
                      {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name.message}</p>}
                    </>
                  ) : (
                    student.name || <Badge color='yellow'>Trống</Badge>
                  )}
                </div>
              </div>

              {/* Date of birth */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Ngày sinh</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <>
                      <Controller control={control} name='dob' render={({ field }) => <Input type='date' min={MIN_DOB} max={MAX_DOB} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)} className={`h-8 ${errors.dob ? 'border-red-500' : ''}`} />} />
                      {errors.dob && <p className='mt-1 text-xs text-red-500'>{errors.dob.message as string}</p>}
                    </>
                  ) : (
                    formatDate(student.dob)
                  )}
                </div>
              </div>

              {/* Class */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Lớp</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <>
                      <div className='flex gap-2'>
                        {/* Grade */}
                        <Select value={currentGrade} onValueChange={(v) => updateClassName('grade', v)}>
                          <SelectTrigger className='h-8 w-20'>
                            <SelectValue placeholder='Khối' />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {/* Letter */}
                        <Select value={currentClassLetter} onValueChange={(v) => updateClassName('letter', v)}>
                          <SelectTrigger className='h-8 w-20'>
                            <SelectValue placeholder='Lớp' />
                          </SelectTrigger>
                          <SelectContent>
                            {classLetterOptions.map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.className && <p className='mt-1 text-xs text-red-500'>{errors.className.message}</p>}
                    </>
                  ) : (
                    student.className || <Badge color='yellow'>Trống</Badge>
                  )}
                </div>
              </div>

              {/* Roll number */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Mã HS</div>
                <div className='flex-1 px-4 py-3'>{student.rollNumber || <Badge color='yellow'>Trống</Badge>}</div>
              </div>

              {/* Address */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Địa chỉ</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <>
                      <Controller control={control} name='address' render={({ field }) => <Input {...field} onChange={(e) => field.onChange(e.target.value.replace(/^\s+/, ''))} className={`h-8 ${errors.address ? 'border-red-500' : ''}`} />} />
                      {errors.address && <p className='mt-1 text-xs text-red-500'>{errors.address.message}</p>}
                    </>
                  ) : (
                    student.address || <Badge color='yellow'>Trống</Badge>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className='flex border-b'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Giới tính</div>
                <div className='flex-1 px-4 py-3'>
                  {editing ? (
                    <>
                      <Controller
                        control={control}
                        name='gender'
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className='h-8 w-full'>
                              <SelectValue placeholder='Chọn giới tính' />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(genderLabels).map(([val, label]) => (
                                <SelectItem key={val} value={val}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.gender && <p className='mt-1 text-xs text-red-500'>{errors.gender.message}</p>}
                    </>
                  ) : (
                    genderLabels[student.gender] || <Badge color='yellow'>Không rõ</Badge>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className='flex'>
                <div className='w-1/4 bg-muted/50 px-4 py-3 font-medium'>Trạng thái</div>
                <div className='flex-1 px-4 py-3'>
                  <Status color={student.status === 'ACTIVE' ? 'green' : 'red'}>{statusLabels[student.status]}</Status>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Avatar */}
          <div className='space-y-4'>
            <h3 className='p-1 text-center text-base font-medium'>Ảnh đại diện</h3>
            <div className='rounded-md border p-3 text-center'>
              <img src={avatarPreview || '/placeholder-avatar.png'} alt='Avatar' className='mx-auto mb-3 h-28 w-28 rounded-full border object-cover' />

              {/* file input */}
              <Input type='file' accept='image/*' onChange={handleAvatarChange} />

              {avatarFile && (
                <div className='mt-3 flex justify-center gap-2'>
                  <Button size='sm' onClick={handleAvatarUpload} disabled={uploadingAvatar}>
                    {uploadingAvatar ? 'Đang tải...' : 'Xác nhận'}
                  </Button>
                  <Button size='sm' variant='outline' onClick={handleAvatarCancel}>
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}
