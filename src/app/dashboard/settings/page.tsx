'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast, toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

// Define the schema for settings form validation
const settingsFormSchema = z.object({
  accountSettings: z.object({
    emailNotifications: z.boolean(),
    marketingEmails: z.boolean(),
    socialConnections: z.boolean(),
    twoFactorAuth: z.boolean(),
  }),
  appearanceSettings: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    compactView: z.boolean(),
    fontSize: z.enum(['sm', 'md', 'lg']),
    animationsEnabled: z.boolean(),
  }),
  privacySettings: z.object({
    profileVisibility: z.enum(['public', 'contacts', 'private']),
    showActivity: z.boolean(),
    showOnlineStatus: z.boolean(),
  }),
})

// Create a type from the schema
type SettingsFormValues = z.infer<typeof settingsFormSchema>

// Default values for the form
const defaultValues: SettingsFormValues = {
  accountSettings: {
    emailNotifications: true,
    marketingEmails: false,
    socialConnections: true,
    twoFactorAuth: false,
  },
  appearanceSettings: {
    theme: 'system',
    compactView: false,
    fontSize: 'md',
    animationsEnabled: true,
  },
  privacySettings: {
    profileVisibility: 'public',
    showActivity: true,
    showOnlineStatus: true,
  },
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toasts, dismiss } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [userSettings, setUserSettings] = useState<SettingsFormValues | null>(null)
  
  // Set up form with default values
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  })

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (status === 'loading') return
      
      if (!session) {
        router.push('/auth/login')
        return
      }
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/settings')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch settings')
        }
        
        const settingsData = await response.json() as SettingsFormValues
        setUserSettings(settingsData)
        
        // Update form with fetched values
        form.reset(settingsData)
      } catch (err: any) {
        console.error('Error fetching settings:', err)
        setError(err.message || 'An error occurred while fetching your settings')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSettings()
  }, [session, status, router, form])

  // Save settings
  const onSubmit: SubmitHandler<SettingsFormValues> = async (data) => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update settings')
      }
      
      const updatedSettings = await response.json() as SettingsFormValues
      setUserSettings(updatedSettings)
      form.reset(updatedSettings)
      setSuccess('Settings updated successfully')
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      })
    } catch (err: any) {
      console.error('Error updating settings:', err)
      setError(err.message || 'An error occurred while saving your settings')
      toast({
        title: "Error",
        description: err.message || "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="flex items-center justify-center p-10">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-24 mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-400 text-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-6 bg-white/60">
              <TabsTrigger value="account" className='data-[state=active]:bg-white data-[state=active]:text-darker'>Account</TabsTrigger>
              <TabsTrigger value="appearance" className='data-[state=active]:bg-white data-[state=active]:text-darker'>Appearance</TabsTrigger>
              <TabsTrigger value="privacy" className='data-[state=active]:bg-white data-[state=active]:text-darker'>Privacy</TabsTrigger>
            </TabsList>
            
            {/* Account Settings Tab */}
            <TabsContent value="account">
              <Card className='bg-white text-darker'>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accountSettings.emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Email Notifications</FormLabel>
                          <FormDescription>Receive notifications via email</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountSettings.marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Marketing Emails</FormLabel>
                          <FormDescription>Receive marketing and promotional emails</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountSettings.socialConnections"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Social Connections</FormLabel>
                          <FormDescription>Allow connections from social platforms</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountSettings.twoFactorAuth"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Two-factor Authentication</FormLabel>
                          <FormDescription>Enable two-factor authentication for additional security</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving} className="bg-light text-white hover:bg-light/90">
                    {isSaving ? 'Saving...' : 'Save Account Settings'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Appearance Settings Tab */}
            <TabsContent value="appearance">
              <Card className='bg-white text-darker'>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize your app appearance and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="appearanceSettings.theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose your preferred theme for the application
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appearanceSettings.fontSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a font size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Adjust the font size for better readability
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appearanceSettings.compactView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Compact View</FormLabel>
                          <FormDescription>Enable compact view for denser content display</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appearanceSettings.animationsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Animations</FormLabel>
                          <FormDescription>Enable interface animations</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving} className='bg-light text-white hover:bg-light/90'>
                    {isSaving ? 'Saving...' : 'Save Appearance Settings'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Privacy Settings Tab */}
            <TabsContent value="privacy">
              <Card className='bg-white text-darker'>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy preferences and data sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="privacySettings.profileVisibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">Public (visible to everyone)</SelectItem>
                            <SelectItem value="contacts">Contacts Only</SelectItem>
                            <SelectItem value="private">Private (only visible to you)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Control who can view your profile information
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacySettings.showActivity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Activity Status</FormLabel>
                          <FormDescription>Show your recent activity to other users</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacySettings.showOnlineStatus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Online Status</FormLabel>
                          <FormDescription>Show when you're online to other users</FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Data Management</h3>
                    <p className="text-sm text-muted-foreground">Manage your personal data</p>
                    
                    <div className="flex flex-col md:flex-row gap-2 mt-4">
                      <Button variant="outline" size="sm">Download Your Data</Button>
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving} className='bg-light text-white hover:bg-light/90'>
                    {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}