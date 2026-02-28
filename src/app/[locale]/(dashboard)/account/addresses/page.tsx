"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react"
import { toast } from "sonner"

interface Address {
  id: string
  label: string
  name: string
  street: string
  city: string
  country: string
  phone: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Home",
    name: "John Doe",
    street: "123 Main St, Apt 4B",
    city: "Riyadh",
    country: "Saudi Arabia",
    phone: "+966 50 123 4567",
    isDefault: true,
  },
  {
    id: "2",
    label: "Work",
    name: "John Doe",
    street: "456 Office Blvd, Floor 3",
    city: "Riyadh",
    country: "Saudi Arabia",
    phone: "+966 50 987 6543",
    isDefault: false,
  },
  {
    id: "3",
    label: "Family",
    name: "Ahmed Doe",
    street: "789 Family Rd",
    city: "Jeddah",
    country: "Saudi Arabia",
    phone: "+966 55 111 2222",
    isDefault: false,
  },
]

export default function AddressesPage() {
  const t = useTranslations("account")
  const tCommon = useTranslations("common")
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    )
    toast.success(tCommon("success"))
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
    toast.success(tCommon("success"))
  }

  const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newAddress: Address = {
      id: Date.now().toString(),
      label: formData.get("label") as string,
      name: formData.get("name") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      phone: formData.get("phone") as string,
      isDefault: false,
    }
    setAddresses([...addresses, newAddress])
    setDialogOpen(false)
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("addresses")}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 me-2" />
              {t("addAddress")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addAddress")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input name="label" placeholder="Home, Work, etc." required />
              </div>
              <div className="space-y-2">
                <Label>{tCommon("name")}</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>{tCommon("address")}</Label>
                <Input name="street" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{tCommon("city")}</Label>
                  <Input name="city" required />
                </div>
                <div className="space-y-2">
                  <Label>{tCommon("country")}</Label>
                  <Input name="country" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{tCommon("phone")}</Label>
                <Input name="phone" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {tCommon("cancel")}
                </Button>
                <Button type="submit">{tCommon("save")}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("noAddresses")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{address.label}</CardTitle>
                  {address.isDefault && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{address.name}</p>
                  <p className="text-muted-foreground">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.country}
                  </p>
                  <p className="text-muted-foreground">{address.phone}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-3 w-3 me-1" />
                      {t("setDefault")}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
