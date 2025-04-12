'use client'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'

interface Props {
  page: number
  total: number
  onPageChange: (page: number) => void
  className?: string
  siblingCount?: number // số trang sát bên
}

export const PaginationControl = ({ page, total, onPageChange, className, siblingCount = 1 }: Props) => {
  if (total <= 1) return null

  const DOTS = 'DOTS'

  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5
    if (totalPageNumbers >= total) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(page - siblingCount, 2)
    const rightSibling = Math.min(page + siblingCount, total - 1)

    const showLeftDots = leftSibling > 2
    const showRightDots = rightSibling < total - 1

    const pages: (number | typeof DOTS)[] = [1]

    if (showLeftDots) {
      pages.push(DOTS)
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i)
    }

    if (showRightDots) {
      pages.push(DOTS)
    }

    pages.push(total)

    return pages
  }

  const pagesToRender = getPageNumbers()

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => page > 1 && onPageChange(page - 1)} />
        </PaginationItem>

        {pagesToRender.map((item, i) => (
          <PaginationItem key={i}>
            {item === DOTS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={item === page} onClick={() => onPageChange(item as number)} href='#'>
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext onClick={() => page < total && onPageChange(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
