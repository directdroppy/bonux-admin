'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdjustPoints } from '@/hooks/use-point-mutation'
import { PlusCircle, MinusCircle } from 'lucide-react'

interface PointManagementDialogProps {
  userId: string
  userName: string
  currentPoints: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PointManagementDialog({
  userId,
  userName,
  currentPoints,
  open,
  onOpenChange,
}: PointManagementDialogProps) {
  const [type, setType] = useState<'add' | 'subtract'>('add')
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')

  const adjustPoints = useAdjustPoints()

  const handleSubmit = async () => {
    const pointsNum = parseInt(points)

    if (!pointsNum || pointsNum <= 0) {
      return
    }

    if (!reason.trim()) {
      return
    }

    try {
      await adjustPoints.mutateAsync({
        userId,
        points: pointsNum,
        type,
        reason: reason.trim(),
      })

      // Reset form
      setPoints('')
      setReason('')
      onOpenChange(false)
    } catch (error) {
      // Error is handled by mutation
    }
  }

  const isValid = points && parseInt(points) > 0 && reason.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Puan Yönetimi</DialogTitle>
          <DialogDescription>
            {userName} kullanıcısı için manuel puan işlemi yapın
          </DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as 'add' | 'subtract')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Puan Ekle
            </TabsTrigger>
            <TabsTrigger value="subtract" className="flex items-center gap-2">
              <MinusCircle className="h-4 w-4" />
              Puan Çıkar
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Mevcut Puan</p>
              <p className="text-2xl font-bold">
                {currentPoints.toLocaleString('tr-TR')}
              </p>
            </div>

            <TabsContent value="add" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-points">Eklenecek Puan</Label>
                <Input
                  id="add-points"
                  type="number"
                  placeholder="Örn: 100"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="1"
                />
              </div>
            </TabsContent>

            <TabsContent value="subtract" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subtract-points">Çıkarılacak Puan</Label>
                <Input
                  id="subtract-points"
                  type="number"
                  placeholder="Örn: 50"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="1"
                  max={currentPoints}
                />
                {parseInt(points) > currentPoints && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Mevcut puandan fazla çıkaramazsınız
                  </p>
                )}
              </div>
            </TabsContent>

            <div className="space-y-2">
              <Label htmlFor="reason">Sebep / Not</Label>
              <Textarea
                id="reason"
                placeholder="Bu işlemin sebebini açıklayın..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {points && parseInt(points) > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  {type === 'add' ? (
                    <>
                      <span className="font-semibold">{points}</span> puan eklenecek
                      <br />
                      Yeni puan:{' '}
                      <span className="font-bold">
                        {(currentPoints + parseInt(points)).toLocaleString('tr-TR')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">{points}</span> puan çıkarılacak
                      <br />
                      Yeni puan:{' '}
                      <span className="font-bold">
                        {Math.max(0, currentPoints - parseInt(points)).toLocaleString('tr-TR')}
                      </span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={adjustPoints.isPending}
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || adjustPoints.isPending || (type === 'subtract' && parseInt(points) > currentPoints)}
          >
            {adjustPoints.isPending ? 'İşleniyor...' : 'Onayla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
