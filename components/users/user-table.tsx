'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SegmentBadge } from './segment-badge'
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react'
import type { User } from '@/hooks/use-users'
import type { UserSegment } from '@/lib/supabase/types'

interface UserTableProps {
  data: User[]
  isLoading: boolean
}

export function UserTable({ data, isLoading }: UserTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: 'Ad Soyad',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('full_name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'E-posta',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.getValue('email')}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telefon',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.getValue('phone') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'segment',
      header: 'Segment',
      cell: ({ row }) => (
        <SegmentBadge segment={row.getValue('segment')} />
      ),
      filterFn: (row, id, value) => {
        return value === 'all' || row.getValue(id) === value
      },
    },
    {
      accessorKey: 'total_points',
      header: 'Toplam Puan',
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.getValue<number>('total_points').toLocaleString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: 'total_savings',
      header: 'Toplam Tasarruf',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-green-600 dark:text-green-400">
          ₺{row.getValue<number>('total_savings').toLocaleString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: 'referral_count',
      header: 'Referanslar',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue<number>('referral_count')}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Kayıt Tarihi',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(row.getValue('created_at')).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: 'last_active_at',
      header: 'Son Aktivite',
      cell: ({ row }) => {
        const lastActive = row.getValue<string | null>('last_active_at')
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {lastActive ? new Date(lastActive).toLocaleDateString('tr-TR') : '-'}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'İşlemler',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/users/${row.original.id}`)}
        >
          Detay
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  const handleExport = () => {
    const csv = [
      ['Ad Soyad', 'E-posta', 'Telefon', 'Segment', 'Toplam Puan', 'Toplam Tasarruf', 'Referanslar', 'Kayıt Tarihi', 'Son Aktivite'],
      ...data.map(user => [
        user.full_name,
        user.email,
        user.phone || '',
        user.segment,
        user.total_points,
        user.total_savings,
        user.referral_count,
        new Date(user.created_at).toLocaleDateString('tr-TR'),
        user.last_active_at ? new Date(user.last_active_at).toLocaleDateString('tr-TR') : '',
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `kullanicilar-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Ad, e-posta veya telefon ile ara..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={(table.getColumn('segment')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('segment')?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Segment seç" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Segmentler</SelectItem>
            <SelectItem value="new">Yeni</SelectItem>
            <SelectItem value="elite">Elite</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="premium_plus">Premium+</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport} variant="outline" className="sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Dışa Aktar
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    {globalFilter || table.getColumn('segment')?.getFilterValue()
                      ? 'Arama kriterlerine uygun kullanıcı bulunamadı.'
                      : 'Henüz kullanıcı bulunmuyor.'}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Toplam {table.getFilteredRowModel().rows.length} kullanıcı
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
