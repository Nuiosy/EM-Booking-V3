import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useDatabase } from '@/lib/hooks/useDatabase'
import { agencySettingsStore } from '@/lib/stores/agencySettingsStore'

export function AgencySettings() {
  const { toast } = useToast()
  const { settings, updateSettings } = agencySettingsStore()
  const { resetDatabase, isLoading } = useDatabase()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agency Settings</h2>
        <p className="text-muted-foreground">
          Manage your agency configuration and database
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="travel-types">Travel Types</TabsTrigger>
          <TabsTrigger value="airports">Airports</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your agency's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* General settings content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel-types">
          <Card>
            <CardHeader>
              <CardTitle>Travel Types</CardTitle>
              <CardDescription>
                Configure available travel types and categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Travel types content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airports">
          <Card>
            <CardHeader>
              <CardTitle>Airports</CardTitle>
              <CardDescription>
                Manage available airports and destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Airports content */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Reset database and manage test data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Reset Database</h3>
                <p className="text-sm text-muted-foreground">
                  This will clear all existing data and create new test data
                </p>
                <Button 
                  variant="destructive" 
                  onClick={resetDatabase}
                  disabled={isLoading}
                >
                  Reset Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}