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
import { SubscriptionBadge } from './subscription-badge'
import { CategoryBadge } from './category-badge'
import { ChevronLeft, ChevronRight, Search, Download, CheckCircle, XCircle } from 'lucide-react'
import type { Business } from '@/hooks/use-businesses'

interface BusinessTableProps {
  data: Business[]
  isLoading: boolean
}

export function BusinessTable({ data, isLoading }: BusinessTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns: ColumnDef<Business>[] = [
    {
      accessorKey: 'name',
      header: 'İşletme Adı',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
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
      accessorKey: 'category',
      header: 'Kategori',
      cell: ({ row }) => (
        <CategoryBadge category={row.getValue('category')} />
      ),
    },
    {
      accessorKey: 'subscription_plan',
      header: 'Abonelik',
      cell: ({ row }) => (
        <SubscriptionBadge tier={row.getValue('subscription_plan') as any} />
      ),
    },
    {
      accessorKey: 'active_campaigns',
      header: 'Aktif Kampanya',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-center">
          {row.getValue<number>('active_campaigns')}
        </div>
      ),
    },
    {
      accessorKey: 'total_redemptions',
      header: 'Kullanım',
      cell: ({ row }) => (
        <div className="text-sm font-medium text-center">
          {row.getValue<number>('total_redemptions')}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Durum',
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>('is_active')
        return isActive ? (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Aktif</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-400">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Pasif</span>
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
          onClick={() => router.push(`/businesses/${row.original.id}`)}
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
      ['İşletme Adı', 'E-posta', 'Telefon', 'Kategori', 'Abonelik', 'Aktif Kampanya', 'Toplam Kullanım', 'Durum', 'Kayıt Tarihi'],
      ...data.map(business => [
        business.name,
        business.email,
        business.phone || '',
        business.category,
        business.subscription_plan || '',
        business.active_campaigns,
        business.total_redemptions,
        business.is_active ? 'Aktif' : 'Pasif',
        new Date(business.created_at).toLocaleDateString('tr-TR'),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `isletmeler-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">İşletmeler yükleniyor...</p>
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
            placeholder="İşletme adı, e-posta veya telefon ile ara..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
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
                    {globalFilter
                      ? 'Arama kriterlerine uygun işletme bulunamadı.'
                      : 'Henüz işletme bulunmuyor.'}
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
          Toplam {table.getFilteredRowModel().rows.length} işletme
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
