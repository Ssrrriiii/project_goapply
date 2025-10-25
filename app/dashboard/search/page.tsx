"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MapPin, Star, GraduationCap, Clock, DollarSign } from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

const mockPrograms = [
  {
    id: 1,
    university: "University of Melbourne",
    program: "Master of Data Science",
    city: "Melbourne",
    state: "Victoria",
    duration: "2 years",
    tuition: "$45,824 AUD/year",
    ranking: "#33 Global",
    rating: 4.8,
    deadline: "Feb 28, 2025",
    requirements: ["GPA: 3.5+", "IELTS: 6.5+", "Work Experience: 2+ years"],
    tags: ["Industry-focused", "Internship", "Part-time work allowed"]
  },
  {
    id: 2,
    university: "Australian National University",
    program: "Master of Computing",
    city: "Canberra",
    state: "ACT",
    duration: "2 years",
    tuition: "$47,940 AUD/year",
    ranking: "#27 Global",
    rating: 4.7,
    deadline: "Mar 31, 2025",
    requirements: ["GPA: 3.6+", "IELTS: 6.5+", "Programming Experience"],
    tags: ["Research-based", "AI/ML", "Government partnerships"]
  },
  {
    id: 3,
    university: "University of Sydney",
    program: "Master of Information Technology",
    city: "Sydney",
    state: "New South Wales", 
    duration: "2 years",
    tuition: "$48,500 AUD/year",
    ranking: "#42 Global",
    rating: 4.6,
    deadline: "Jan 31, 2025",
    requirements: ["GPA: 3.4+", "IELTS: 6.5+", "Programming Background"],
    tags: ["Industry partnerships", "Flexible study", "Career support"]
  },
  {
    id: 4,
    university: "Monash University",
    program: "Master of Applied Data Science",
    city: "Melbourne",
    state: "Victoria",
    duration: "1.5-2 years",
    tuition: "$46,000 AUD/year",
    ranking: "#57 Global",
    rating: 4.5,
    deadline: "Mar 15, 2025",
    requirements: ["GPA: 3.3+", "IELTS: 6.5+", "Math/Stats Background"],
    tags: ["Industry-focused", "Flexible duration", "Research projects"]
  },
  {
    id: 5,
    university: "University of Queensland",
    program: "Master of Computer Science",
    city: "Brisbane",
    state: "Queensland",
    duration: "2 years",
    tuition: "$44,672 AUD/year",
    ranking: "#50 Global",
    rating: 4.4,
    deadline: "May 31, 2025",
    requirements: ["GPA: 3.2+", "IELTS: 6.5+", "CS Background preferred"],
    tags: ["Research excellence", "Thesis option", "Industry connections"]
  },
  {
    id: 6,
    university: "University of Western Australia",
    program: "Master of Information Technology",
    city: "Perth",
    state: "Western Australia",
    duration: "2 years",
    tuition: "$39,800 AUD/year",
    ranking: "#92 Global",
    rating: 4.3,
    deadline: "Jun 30, 2025",
    requirements: ["GPA: 3.0+", "IELTS: 6.5+", "Any Bachelor's degree"],
    tags: ["Career conversion", "Practical focus", "Work placement"]
  }
]

export default function SearchPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedField, setSelectedField] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [tuitionRange, setTuitionRange] = useState([30000, 60000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [minRating, setMinRating] = useState(4.0)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filter programs based on search criteria
  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = searchQuery === "" || 
      program.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.university.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesState = selectedState === "" || 
      program.state.toLowerCase().replace(/\s+/g, '-') === selectedState
    
    const matchesField = selectedField === "" || 
      program.program.toLowerCase().includes(selectedField.replace('-', ' '))
    
    const matchesLevel = selectedLevel === "" || 
      program.program.toLowerCase().includes(selectedLevel.replace('s', ''))
    
    const tuitionValue = parseInt(program.tuition.replace(/[$,AUD/year\s]/g, ''))
    const matchesTuition = tuitionValue >= tuitionRange[0] && tuitionValue <= tuitionRange[1]
    
    const matchesRating = program.rating >= minRating
    
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.some(feature => program.tags.some(tag => 
        tag.toLowerCase().includes(feature.toLowerCase())
      ))
    
    return matchesSearch && matchesState && matchesField && matchesLevel && 
           matchesTuition && matchesRating && matchesFeatures
  })

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
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
                <h1 className="text-3xl font-bold text-foreground">Find Programs</h1>
                <p className="text-muted-foreground mt-1">Discover programs that match your interests and goals</p>
              </motion.div>

              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Search & Filter Programs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="search">Search Programs</Label>
                        <Input
                          id="search"
                          placeholder="Computer Science, Engineering..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-background/50 backdrop-blur border-border/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>State/Territory</Label>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                          <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="victoria">Victoria</SelectItem>
                            <SelectItem value="new-south-wales">New South Wales</SelectItem>
                            <SelectItem value="queensland">Queensland</SelectItem>
                            <SelectItem value="western-australia">Western Australia</SelectItem>
                            <SelectItem value="south-australia">South Australia</SelectItem>
                            <SelectItem value="tasmania">Tasmania</SelectItem>
                            <SelectItem value="act">ACT</SelectItem>
                            <SelectItem value="northern-territory">Northern Territory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Select value={selectedField} onValueChange={setSelectedField}>
                          <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="data-science">Data Science</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="medicine">Medicine</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Study Level</Label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                          <SelectTrigger className="bg-background/50 backdrop-blur border-border/50">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="masters">Master's</SelectItem>
                            <SelectItem value="bachelors">Bachelor's</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        <Search className="w-4 h-4 mr-2" />
                        Search Programs
                      </Button>
                      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-background/50 backdrop-blur border-border/50">
                            <Filter className="w-4 h-4 mr-2" />
                            Advanced Filters
                            {(selectedFeatures.length > 0 || minRating > 4.0 || tuitionRange[0] !== 30000 || tuitionRange[1] !== 60000) && (
                              <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                                {selectedFeatures.length + (minRating > 4.0 ? 1 : 0) + (tuitionRange[0] !== 30000 || tuitionRange[1] !== 60000 ? 1 : 0)}
                              </Badge>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Advanced Filters</DialogTitle>
                            <DialogDescription>
                              Refine your search with additional criteria
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Tuition Range */}
                            <div className="space-y-3">
                              <Label>Annual Tuition Range (AUD)</Label>
                              <div className="px-2">
                                <Slider
                                  value={tuitionRange}
                                  onValueChange={setTuitionRange}
                                  max={80000}
                                  min={20000}
                                  step={5000}
                                  className="w-full"
                                />
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>${tuitionRange[0].toLocaleString()}</span>
                                <span>${tuitionRange[1].toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Minimum Rating */}
                            <div className="space-y-3">
                              <Label>Minimum Rating</Label>
                              <div className="px-2">
                                <Slider
                                  value={[minRating]}
                                  onValueChange={(value) => setMinRating(value[0])}
                                  max={5.0}
                                  min={3.0}
                                  step={0.1}
                                  className="w-full"
                                />
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>3.0</span>
                                <span className="font-medium">{minRating.toFixed(1)} ⭐</span>
                                <span>5.0</span>
                              </div>
                            </div>

                            {/* Program Features */}
                            <div className="space-y-3">
                              <Label>Program Features</Label>
                              <div className="grid grid-cols-1 gap-3">
                                {["Industry-focused", "Research-based", "Internship", "Part-time work allowed", "AI/ML", "Scholarships available"].map((feature) => (
                                  <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={feature}
                                      checked={selectedFeatures.includes(feature)}
                                      onCheckedChange={() => handleFeatureToggle(feature)}
                                    />
                                    <Label htmlFor={feature} className="text-sm font-normal">
                                      {feature}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setTuitionRange([30000, 60000])
                                  setMinRating(4.0)
                                  setSelectedFeatures([])
                                }}
                                className="flex-1"
                              >
                                Clear All
                              </Button>
                              <Button 
                                onClick={() => setShowAdvancedFilters(false)}
                                className="flex-1"
                              >
                                Apply Filters
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
                  <p className="text-sm text-muted-foreground">{filteredPrograms.length} programs found</p>
                </div>

                <div className="grid gap-6">
                  {filteredPrograms.map((program, index) => (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card className="bg-card/50 backdrop-blur border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-primary/20">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* University Logo */}
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-8 h-8 text-primary" />
                              </div>
                            </div>

                            {/* Program Details */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">{program.program}</h3>
                                  <p className="text-muted-foreground">{program.university}</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {program.city}, {program.state}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {program.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      {program.tuition}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right space-y-1">
                                  <Badge variant="secondary">{program.ranking}</Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{program.rating}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {program.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Requirements */}
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">Requirements:</p>
                                <div className="flex flex-wrap gap-2">
                                  {program.requirements.map((req) => (
                                    <span key={req} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                      {req}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center justify-between pt-2">
                                <p className="text-sm text-muted-foreground">
                                  Application deadline: <span className="font-medium text-foreground">{program.deadline}</span>
                                </p>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Learn More
                                  </Button>
                                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}