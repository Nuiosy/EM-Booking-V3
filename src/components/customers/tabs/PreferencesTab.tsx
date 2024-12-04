import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TRAVEL_PREFERENCES, INTERESTS, LANGUAGES } from "@/lib/constants/customerData"

interface PreferencesTabProps {
  preferences: {
    travelPreferences: string[]
    interests: string[]
    groupMembership: string[]
    generalNotes: string
    adviceType: string
    languages: string[]
    healthNotes: string
    financialNotes: string
    specialRequirements: string
  }
  onChange: (preferences: any) => void
}

export function PreferencesTab({ preferences, onChange }: PreferencesTabProps) {
  const [newPreference, setNewPreference] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [newGroup, setNewGroup] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  const handleAddPreference = () => {
    if (newPreference && !preferences.travelPreferences.includes(newPreference)) {
      onChange({
        ...preferences,
        travelPreferences: [...preferences.travelPreferences, newPreference]
      })
      setNewPreference("")
    }
  }

  const handleRemovePreference = (pref: string) => {
    onChange({
      ...preferences,
      travelPreferences: preferences.travelPreferences.filter(p => p !== pref)
    })
  }

  const handleAddInterest = () => {
    if (newInterest && !preferences.interests.includes(newInterest)) {
      onChange({
        ...preferences,
        interests: [...preferences.interests, newInterest]
      })
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (interest: string) => {
    onChange({
      ...preferences,
      interests: preferences.interests.filter(i => i !== interest)
    })
  }

  const handleAddGroup = () => {
    if (newGroup && !preferences.groupMembership.includes(newGroup)) {
      onChange({
        ...preferences,
        groupMembership: [...preferences.groupMembership, newGroup]
      })
      setNewGroup("")
    }
  }

  const handleRemoveGroup = (group: string) => {
    onChange({
      ...preferences,
      groupMembership: preferences.groupMembership.filter(g => g !== group)
    })
  }

  const handleAddLanguage = () => {
    if (newLanguage && !preferences.languages.includes(newLanguage)) {
      onChange({
        ...preferences,
        languages: [...preferences.languages, newLanguage]
      })
      setNewLanguage("")
    }
  }

  const handleRemoveLanguage = (lang: string) => {
    onChange({
      ...preferences,
      languages: preferences.languages.filter(l => l !== lang)
    })
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Travel Preferences */}
        <div className="space-y-2">
          <Label>Travel Preferences</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {preferences.travelPreferences.map((pref) => (
              <Badge key={pref} variant="secondary" className="flex items-center gap-1">
                {pref}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemovePreference(pref)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newPreference} onValueChange={setNewPreference}>
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_PREFERENCES.map((pref) => (
                  <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddPreference}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {preferences.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                {interest}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newInterest} onValueChange={setNewInterest}>
              <SelectTrigger>
                <SelectValue placeholder="Select interest" />
              </SelectTrigger>
              <SelectContent>
                {INTERESTS.map((interest) => (
                  <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddInterest}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {preferences.languages.map((lang) => (
              <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                {lang}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveLanguage(lang)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newLanguage} onValueChange={setNewLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Group Membership */}
        <div className="space-y-2">
          <Label>Group Membership</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {preferences.groupMembership.map((group) => (
              <Badge key={group} variant="secondary" className="flex items-center gap-1">
                {group}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveGroup(group)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              placeholder="Enter group name"
            />
            <Button onClick={handleAddGroup}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notes and Additional Information */}
        <div className="space-y-4">
          <div>
            <Label>Advice Type</Label>
            <Input
              value={preferences.adviceType}
              onChange={(e) => onChange({ ...preferences, adviceType: e.target.value })}
              placeholder="Enter advice type"
            />
          </div>

          <div>
            <Label>General Notes</Label>
            <Textarea
              value={preferences.generalNotes}
              onChange={(e) => onChange({ ...preferences, generalNotes: e.target.value })}
              placeholder="Enter general notes about the customer"
            />
          </div>

          <div>
            <Label>Health Notes</Label>
            <Textarea
              value={preferences.healthNotes}
              onChange={(e) => onChange({ ...preferences, healthNotes: e.target.value })}
              placeholder="Enter any health-related notes"
            />
          </div>

          <div>
            <Label>Financial Notes</Label>
            <Textarea
              value={preferences.financialNotes}
              onChange={(e) => onChange({ ...preferences, financialNotes: e.target.value })}
              placeholder="Enter financial notes"
            />
          </div>

          <div>
            <Label>Special Requirements</Label>
            <Textarea
              value={preferences.specialRequirements}
              onChange={(e) => onChange({ ...preferences, specialRequirements: e.target.value })}
              placeholder="Enter any special requirements"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}