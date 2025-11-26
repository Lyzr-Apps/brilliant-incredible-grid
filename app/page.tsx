'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Menu, Bell, User, Filter, Download, CheckCircle, XCircle, Clock, User2, Building2, Mail, Phone, Briefcase, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  parsedData?: any
}

interface Candidate {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  appliedDate: string
  status: 'applied' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected'
  experience: number
  skills: string[]
}

interface JobOpening {
  id: string
  title: string
  department: string
  postedDate: string
  applicants: number
  status: 'open' | 'closed'
  location: string
  experience: string
}

interface InterviewRecord {
  id: string
  candidateName: string
  position: string
  interviewDate: string
  interviewer: string
  status: 'scheduled' | 'completed' | 'pending'
  feedback?: string
}

// Sample Data
const SAMPLE_CANDIDATES: Candidate[] = [
  {
    id: 'CND001',
    name: 'Emma Watson',
    position: 'Senior Engineer',
    department: 'Engineering',
    email: 'emma.watson@email.com',
    phone: '+1-234-567-8901',
    appliedDate: '2024-01-10',
    status: 'interviewed',
    experience: 5,
    skills: ['React', 'Node.js', 'Python'],
  },
  {
    id: 'CND002',
    name: 'John Smith',
    position: 'Product Manager',
    department: 'Product',
    email: 'john.smith@email.com',
    phone: '+1-234-567-8902',
    appliedDate: '2024-01-12',
    status: 'shortlisted',
    experience: 7,
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
  },
  {
    id: 'CND003',
    name: 'Sarah Johnson',
    position: 'UX Designer',
    department: 'Design',
    email: 'sarah.johnson@email.com',
    phone: '+1-234-567-8903',
    appliedDate: '2024-01-08',
    status: 'interviewed',
    experience: 4,
    skills: ['Figma', 'User Research', 'Prototyping'],
  },
  {
    id: 'CND004',
    name: 'Michael Chen',
    position: 'Data Engineer',
    department: 'Engineering',
    email: 'michael.chen@email.com',
    phone: '+1-234-567-8904',
    appliedDate: '2024-01-15',
    status: 'applied',
    experience: 6,
    skills: ['SQL', 'Python', 'Spark', 'AWS'],
  },
  {
    id: 'CND005',
    name: 'Lisa Rodriguez',
    position: 'Marketing Manager',
    department: 'Marketing',
    email: 'lisa.rodriguez@email.com',
    phone: '+1-234-567-8905',
    appliedDate: '2024-01-11',
    status: 'offered',
    experience: 8,
    skills: ['Digital Marketing', 'Brand Strategy', 'Analytics'],
  },
  {
    id: 'CND006',
    name: 'David Kim',
    position: 'Backend Engineer',
    department: 'Engineering',
    email: 'david.kim@email.com',
    phone: '+1-234-567-8906',
    appliedDate: '2024-01-09',
    status: 'shortlisted',
    experience: 5,
    skills: ['Java', 'Spring Boot', 'Microservices'],
  },
  {
    id: 'CND007',
    name: 'Angela Martinez',
    position: 'QA Engineer',
    department: 'Engineering',
    email: 'angela.martinez@email.com',
    phone: '+1-234-567-8907',
    appliedDate: '2024-01-13',
    status: 'applied',
    experience: 3,
    skills: ['Automation Testing', 'Selenium', 'Manual QA'],
  },
  {
    id: 'CND008',
    name: 'Robert Taylor',
    position: 'DevOps Engineer',
    department: 'Engineering',
    email: 'robert.taylor@email.com',
    phone: '+1-234-567-8908',
    appliedDate: '2024-01-14',
    status: 'shortlisted',
    experience: 6,
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD'],
  },
]

const SAMPLE_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'JOB001',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    postedDate: '2024-01-01',
    applicants: 12,
    status: 'open',
    location: 'San Francisco',
    experience: '5+ years',
  },
  {
    id: 'JOB002',
    title: 'Product Manager',
    department: 'Product',
    postedDate: '2024-01-03',
    applicants: 8,
    status: 'open',
    location: 'New York',
    experience: '7+ years',
  },
  {
    id: 'JOB003',
    title: 'UX Designer',
    department: 'Design',
    postedDate: '2024-01-02',
    applicants: 6,
    status: 'open',
    location: 'Remote',
    experience: '3+ years',
  },
  {
    id: 'JOB004',
    title: 'Data Engineer',
    department: 'Engineering',
    postedDate: '2024-01-05',
    applicants: 10,
    status: 'open',
    location: 'San Francisco',
    experience: '5+ years',
  },
  {
    id: 'JOB005',
    title: 'Marketing Manager',
    department: 'Marketing',
    postedDate: '2024-01-04',
    applicants: 7,
    status: 'closed',
    location: 'Remote',
    experience: '7+ years',
  },
]

const SAMPLE_INTERVIEWS: InterviewRecord[] = [
  {
    id: 'INT001',
    candidateName: 'Emma Watson',
    position: 'Senior Engineer',
    interviewDate: '2024-01-20',
    interviewer: 'John Doe',
    status: 'completed',
    feedback: 'Strong technical skills and good communication',
  },
  {
    id: 'INT002',
    candidateName: 'Sarah Johnson',
    position: 'UX Designer',
    interviewDate: '2024-01-22',
    interviewer: 'Jane Smith',
    status: 'scheduled',
  },
  {
    id: 'INT003',
    candidateName: 'John Smith',
    position: 'Product Manager',
    interviewDate: '2024-01-25',
    interviewer: 'Mike Johnson',
    status: 'pending',
  },
]

// Candidate Card Component
function CandidateCardComponent({ candidate }: { candidate: Candidate }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800'
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800'
      case 'interviewed':
        return 'bg-purple-100 text-purple-800'
      case 'offered':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="mb-3 border border-gray-200 bg-white">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
            <p className="text-sm text-gray-600">{candidate.position}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Building2 className="h-3 w-3" />
                {candidate.department}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="h-3 w-3" />
                {candidate.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="h-3 w-3" />
                {candidate.phone}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {candidate.skills.map((skill, i) => (
                <Badge key={i} variant="outline" className="text-xs border-gray-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <Badge className={cn('font-medium', getStatusColor(candidate.status))}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
            <p className="mt-2 text-xs text-gray-600">{candidate.experience} yrs exp</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full text-gray-900 border-gray-200 hover:bg-gray-50">
          View Profile
        </Button>
      </CardContent>
    </Card>
  )
}

// Job Opening Card Component
function JobOpeningCardComponent({ job }: { job: JobOpening }) {
  return (
    <Card className="mb-3 border border-gray-200 bg-white">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
            </div>
            <p className="mt-1 text-sm text-gray-600">{job.department}</p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-600">
                <span className="font-medium text-gray-900">{job.experience}</span> experience required
              </div>
              <div className="text-xs text-gray-600">
                Posted: {job.postedDate}
              </div>
              <div className="text-xs text-gray-600">
                Location: {job.location}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className={cn('font-medium', job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            <p className="mt-2 text-2xl font-bold text-gray-900">{job.applicants}</p>
            <p className="text-xs text-gray-600">Applicants</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full text-gray-900 border-gray-200 hover:bg-gray-50">
          View Candidates
        </Button>
      </CardContent>
    </Card>
  )
}

// Interview Schedule Table Component
function InterviewTableComponent({
  records,
}: {
  records: InterviewRecord[]
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Candidate Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Position</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Interview Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Interviewer</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{record.candidateName}</td>
                <td className="px-4 py-3 text-gray-700">{record.position}</td>
                <td className="px-4 py-3 text-gray-700">{record.interviewDate}</td>
                <td className="px-4 py-3 text-gray-700">{record.interviewer}</td>
                <td className="px-4 py-3">
                  <Badge className={cn('font-medium', getStatusColor(record.status))}>
                    {record.status === 'scheduled' && <Clock className="mr-1 inline h-3 w-3" />}
                    {record.status === 'completed' && <CheckCircle className="mr-1 inline h-3 w-3" />}
                    {record.status === 'pending' && <XCircle className="mr-1 inline h-3 w-3" />}
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{record.feedback ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Component
export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [candidates, setCandidates] = useState<Candidate[]>(SAMPLE_CANDIDATES)
  const [interviews, setInterviews] = useState<InterviewRecord[]>(SAMPLE_INTERVIEWS)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          agent_id: '6926c30fe758b644132e0744',
        }),
      })

      const data = await response.json()

      let parsedData = null
      if (data.success && data.response) {
        parsedData = data.response
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.raw_response ?? data.response?.result ?? 'Processing your request...',
        timestamp: new Date(),
        parsedData: parsedData,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling agent:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Error processing request. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCandidates = () => {
    let filtered = candidates

    if (selectedDepartment && selectedDepartment !== 'all') {
      filtered = filtered.filter((c) => c.department.toLowerCase() === selectedDepartment.toLowerCase())
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === selectedStatus)
    }

    return filtered
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          'flex flex-col border-r border-gray-200 bg-white transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {sidebarOpen && <h1 className="text-lg font-bold text-blue-600">Hiring Module</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {[
            { icon: User2, label: 'Candidates', active: true },
            { icon: Target, label: 'Job Openings' },
            { icon: Briefcase, label: 'Interviews' },
            { icon: Filter, label: 'Reports' },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
                item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-sm">
                <p className="font-medium text-gray-900">Recruiter</p>
                <p className="text-xs text-gray-600">recruiter@company.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h2 className="text-xl font-semibold text-gray-900">Hiring Assistant Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex flex-1 flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-8">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Briefcase className="mb-4 h-16 w-16 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900">Welcome to Hiring Assistant</h3>
                    <p className="mt-2 max-w-md text-sm text-gray-600">
                      Ask me anything about candidates, job openings, interview schedules, or hiring reports.
                    </p>
                    <div className="mt-8 grid gap-3 text-left">
                      <p className="text-xs font-semibold text-gray-700">Try asking:</p>
                      <div className="space-y-2">
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "Show all candidates in engineering"
                        </div>
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "List interview schedules for next week"
                        </div>
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "Show open job positions"
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn('mb-4 flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-2xl rounded-lg px-4 py-3',
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>

                        {message.parsedData && (
                          <div className="mt-4 space-y-4">
                            {message.parsedData.query_type === 'candidate_search' &&
                              message.parsedData.formatted_data?.type === 'card' && (
                                <div>
                                  {getFilteredCandidates().slice(0, 3).map((candidate) => (
                                    <CandidateCardComponent key={candidate.id} candidate={candidate} />
                                  ))}
                                </div>
                              )}

                            {message.parsedData.query_type === 'job_inquiry' &&
                              message.parsedData.formatted_data?.type === 'card' && (
                                <div>
                                  {SAMPLE_JOB_OPENINGS.slice(0, 3).map((job) => (
                                    <JobOpeningCardComponent key={job.id} job={job} />
                                  ))}
                                </div>
                              )}

                            {message.parsedData.query_type === 'interview_query' &&
                              message.parsedData.formatted_data?.type === 'table' && (
                                <InterviewTableComponent records={interviews} />
                              )}

                            {message.parsedData.follow_up_suggestions && (
                              <div className="flex flex-wrap gap-2 pt-3">
                                {message.parsedData.follow_up_suggestions.map((suggestion: string, i: number) => (
                                  <button
                                    key={i}
                                    onClick={() => setInput(suggestion)}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={scrollAreaRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white p-6">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Ask Hiring Assistant..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="border-gray-200 text-gray-900 placeholder-gray-500"
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                  {loading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Panel - Filters */}
          <div className="w-72 border-l border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Filters</h3>

            <div className="space-y-6">
              {/* Department Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-gray-200 text-gray-900">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Candidate Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-gray-200 text-gray-900">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900">Quick Stats</h4>
                <div className="space-y-2">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="text-xs text-gray-600">Total Candidates</div>
                    <div className="text-lg font-bold text-blue-600">{candidates.length}</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="text-xs text-gray-600">Open Positions</div>
                    <div className="text-lg font-bold text-green-600">{SAMPLE_JOB_OPENINGS.filter(j => j.status === 'open').length}</div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <div className="text-xs text-gray-600">Pending Interviews</div>
                    <div className="text-lg font-bold text-yellow-600">{interviews.filter(i => i.status === 'pending').length}</div>
                  </div>
                </div>
              </div>

              {/* Recent Candidates */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900">Recent Candidates</h4>
                <div className="space-y-2">
                  {getFilteredCandidates()
                    .slice(0, 3)
                    .map((candidate) => (
                      <div key={candidate.id} className="rounded-lg bg-gray-50 p-3 text-xs">
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                        <p className="mt-1 text-gray-600">{candidate.position}</p>
                        <p className="mt-1 text-gray-500">{candidate.appliedDate}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Export Button */}
              <Button variant="outline" className="w-full gap-2 border-gray-200 text-gray-900 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
