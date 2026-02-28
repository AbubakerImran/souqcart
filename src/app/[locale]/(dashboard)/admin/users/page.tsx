"use client"

import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { formatDate } from "@/lib/utils"

const mockUsers = [
  { id: "1", name: "Ahmed Ali", email: "ahmed@example.com", role: "customer", date: "2024-06-15", status: "active" },
  { id: "2", name: "Sara Khan", email: "sara@example.com", role: "customer", date: "2024-07-20", status: "active" },
  { id: "3", name: "Omar Hassan", email: "omar@example.com", role: "vendor", date: "2024-08-10", status: "active" },
  { id: "4", name: "Fatima Ahmed", email: "fatima@example.com", role: "customer", date: "2024-09-05", status: "inactive" },
  { id: "5", name: "Youssef Salem", email: "youssef@example.com", role: "vendor", date: "2024-10-12", status: "active" },
  { id: "6", name: "Layla Nasser", email: "layla@example.com", role: "admin", date: "2024-03-01", status: "active" },
  { id: "7", name: "Khalid Mansour", email: "khalid@example.com", role: "customer", date: "2024-11-20", status: "active" },
  { id: "8", name: "Noor Ali", email: "noor@example.com", role: "customer", date: "2024-12-01", status: "inactive" },
]

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  vendor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  customer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

export default function AdminUsersPage() {
  const t = useTranslations("admin")
  const tCommon = useTranslations("common")
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "en"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("manageUsers")}</h1>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={tCommon("search") + "..."} className="ps-9" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>{tCommon("email")}</TableHead>
                <TableHead>{tCommon("role")}</TableHead>
                <TableHead>{tCommon("date")}</TableHead>
                <TableHead>{tCommon("status")}</TableHead>
                <TableHead className="text-right">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]} variant="secondary">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.date, locale)}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select defaultValue={user.role}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
