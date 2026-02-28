"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"

export default function ProfilePage() {
  const t = useTranslations("account")
  const tCommon = useTranslations("common")
  const [name, setName] = useState("John Doe")
  const [phone, setPhone] = useState("+966 50 123 4567")
  const [langPref, setLangPref] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tCommon("success"))
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(tCommon("success"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("profile")}</h1>
      </div>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle>{t("editProfile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>{tCommon("name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button type="submit">{t("saveChanges")}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>{t("changePw")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>{t("currentPw")}</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>{t("newPw")}</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>{t("confirmPw")}</Label>
              <Input type="password" />
            </div>
            <Button type="submit">{t("saveChanges")}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <CardTitle>{t("languagePreference")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">العربية / English</p>
              <p className="text-sm text-muted-foreground">
                Toggle to switch between Arabic and English
              </p>
            </div>
            <Switch checked={langPref} onCheckedChange={setLangPref} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
