"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  Briefcase,
  Globe,
  Edit,
  Save,
  Upload,
  Award,
  Languages,
  BookOpen
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const { user, profile, updateProfile } = useAuth()

  // Keep track of original data for cancel functionality
  const [originalData, setOriginalData] = useState({})
  
  // Profile data from Auth context with fallbacks
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    dateOfBirth: profile?.dateOfBirth || "",
    nationality: profile?.nationality || "Australian",
    address: profile?.address || "",
    bio: profile?.bio || "",
    
    // Education
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Toronto",
        graduationYear: "2022",
        gpa: "3.8/4.0",
        honors: "Magna Cum Laude"
      }
    ],
    
    // Experience
    experience: [
      {
        title: "Software Developer Intern",
        company: "Tech Solutions Inc.",
        duration: "Jun 2021 - Aug 2021",
        description: "Developed web applications using React and Node.js, collaborated with cross-functional teams."
      },
      {
        title: "Research Assistant",
        company: "University of Toronto",
        duration: "Sep 2020 - May 2022",
        description: "Conducted research on machine learning algorithms under Prof. Smith's supervision."
      }
    ],
    
    // Skills & Languages
    technicalSkills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Analysis"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "French", proficiency: "Conversational" },
      { language: "Mandarin", proficiency: "Basic" }
    ],
    
    // Achievements
    achievements: [
      "Dean's List - 4 semesters",
      "Best Project Award - CS Capstone 2022",
      "Hackathon Winner - UofT Hacks 2021"
    ]
  })

  // Sync profile data with Auth context when it changes
  useEffect(() => {
    if (user || profile) {
      const updatedData = {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        dateOfBirth: profile?.dateOfBirth || "",
        nationality: profile?.nationality || "Australian",
        address: profile?.address || "",
        bio: profile?.bio || "",
      }
      setProfileData(prev => ({
        ...prev,
        ...updatedData
      }))
      // Also update original data to preserve current state
      setOriginalData(prev => ({
        ...prev,
        ...updatedData
      }))
    }
  }, [user, profile])

  const handleSave = async () => {
    try {
      // Update profile through Auth context
      await updateProfile({
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        nationality: profileData.nationality,
        address: profileData.address,
        bio: profileData.bio,
        // Also update user's basic information (cast to any to bypass type restriction)
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      } as any)
      
      // Update original data to current data after successful save
      setOriginalData({ ...profileData })
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCancel = () => {
    // Restore data to original state
    setProfileData({ ...profileData, ...originalData })
    setIsEditing(false)
  }

  const handleEdit = () => {
    // Store current state as original before editing
    setOriginalData({ ...profileData })
    setIsEditing(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Profile Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                          <AvatarFallback className="text-2xl">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground">
                          {profileData.firstName} {profileData.lastName}
                        </h2>
                        <p className="text-muted-foreground mb-2">{profileData.email}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profileData.nationality}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Born {new Date(profileData.dateOfBirth).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {profileData.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal and professional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      </TabsList>

                      {/* Personal Information */}
                      <TabsContent value="personal" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                              id="nationality"
                              value={profileData.nationality}
                              onChange={(e) => handleInputChange("nationality", e.target.value)}
                              disabled={!isEditing}
                              className="bg-background/50 backdrop-blur border-border/50"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={profileData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            disabled={!isEditing}
                            className="bg-background/50 backdrop-blur border-border/50"
                            rows={4}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </TabsContent>

                      {/* Education */}
                      <TabsContent value="education" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">Education History</h3>
                          {isEditing && (
                            <Button size="sm" variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Add Education
                            </Button>
                          )}
                        </div>
                        
                        {profileData.education.map((edu, index) => (
                          <div key={index} className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                                <p className="text-muted-foreground">{edu.institution}</p>
                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                  <span>Graduated: {edu.graduationYear}</span>
                                  <span>GPA: {edu.gpa}</span>
                                  <span>{edu.honors}</span>
                                </div>
                              </div>
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Experience */}
                      <TabsContent value="experience" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                          {isEditing && (
                            <Button size="sm" variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                              <Briefcase className="w-4 h-4 mr-2" />
                              Add Experience
                            </Button>
                          )}
                        </div>
                        
                        {profileData.experience.map((exp, index) => (
                          <div key={index} className="border border-border/50 rounded-lg p-4 bg-background/50 backdrop-blur">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{exp.title}</h4>
                                <p className="text-muted-foreground">{exp.company}</p>
                                <p className="text-sm text-muted-foreground mb-2">{exp.duration}</p>
                                <p className="text-sm text-foreground">{exp.description}</p>
                              </div>
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Skills */}
                      <TabsContent value="skills" className="space-y-6 mt-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">Technical Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {profileData.technicalSkills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {skill}
                              </Badge>
                            ))}
                            {isEditing && (
                              <Button size="sm" variant="outline" className="h-6 bg-background/50 backdrop-blur border-border/50">
                                + Add Skill
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-4">Languages</h3>
                          <div className="space-y-3">
                            {profileData.languages.map((lang, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-background/50 backdrop-blur">
                                <div className="flex items-center gap-2">
                                  <Languages className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{lang.language}</span>
                                </div>
                                <Badge variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                                  {lang.proficiency}
                                </Badge>
                              </div>
                            ))}
                            {isEditing && (
                              <Button size="sm" variant="outline" className="w-full bg-background/50 backdrop-blur border-border/50">
                                <Languages className="w-4 h-4 mr-2" />
                                Add Language
                              </Button>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      {/* Achievements */}
                      <TabsContent value="achievements" className="space-y-6 mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">Achievements & Awards</h3>
                          {isEditing && (
                            <Button size="sm" variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                              <Award className="w-4 h-4 mr-2" />
                              Add Achievement
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {profileData.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg bg-background/50 backdrop-blur">
                              <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                              <span className="text-foreground">{achievement}</span>
                              {isEditing && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}