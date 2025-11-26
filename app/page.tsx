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
import { Send, Menu, Bell, User, ChevronDown, Calendar, Filter, Download, CheckCircle, XCircle, Clock, User2, Building2, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  parsedData?: any
}

interface EmployeeCard {
  id: string
  name: string
  designation: string
  department: string
  email: string
  phone: string
  leaveBalance?: number
}

interface LeaveRecord {
  id: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected'
  days: number
}

interface AttendanceDay {
  date: string
  status: 'present' | 'absent' | 'half-day'
}

// Dummy Data
const SAMPLE_EMPLOYEES: EmployeeCard[] = [
  {
    id: 'EMP001',
    name: 'Emma Watson',
    designation: 'HR Manager',
    department: 'Human Resources',
    email: 'emma.watson@company.com',
    phone: '+1-234-567-8901',
    leaveBalance: 12,
  },
  {
    id: 'EMP002',
    name: 'John Smith',
    designation: 'Software Engineer',
    department: 'Engineering',
    email: 'john.smith@company.com',
    phone: '+1-234-567-8902',
    leaveBalance: 15,
  },
  {
    id: 'EMP003',
    name: 'Sarah Johnson',
    designation: 'Product Manager',
    department: 'Product',
    email: 'sarah.johnson@company.com',
    phone: '+1-234-567-8903',
    leaveBalance: 10,
  },
  {
    id: 'EMP004',
    name: 'Michael Chen',
    designation: 'Data Analyst',
    department: 'Analytics',
    email: 'michael.chen@company.com',
    phone: '+1-234-567-8904',
    leaveBalance: 14,
  },
  {
    id: 'EMP005',
    name: 'Lisa Rodriguez',
    designation: 'Designer',
    department: 'Design',
    email: 'lisa.rodriguez@company.com',
    phone: '+1-234-567-8905',
    leaveBalance: 13,
  },
  {
    id: 'EMP006',
    name: 'David Kim',
    designation: 'QA Engineer',
    department: 'Engineering',
    email: 'david.kim@company.com',
    phone: '+1-234-567-8906',
    leaveBalance: 11,
  },
  {
    id: 'EMP007',
    name: 'Angela Martinez',
    designation: 'Operations Manager',
    department: 'Operations',
    email: 'angela.martinez@company.com',
    phone: '+1-234-567-8907',
    leaveBalance: 9,
  },
  {
    id: 'EMP008',
    name: 'Robert Taylor',
    designation: 'Backend Engineer',
    department: 'Engineering',
    email: 'robert.taylor@company.com',
    phone: '+1-234-567-8908',
    leaveBalance: 16,
  },
  {
    id: 'EMP009',
    name: 'Jennifer Lee',
    designation: 'Marketing Manager',
    department: 'Marketing',
    email: 'jennifer.lee@company.com',
    phone: '+1-234-567-8909',
    leaveBalance: 12,
  },
  {
    id: 'EMP010',
    name: 'Thomas Wilson',
    designation: 'Finance Analyst',
    department: 'Finance',
    email: 'thomas.wilson@company.com',
    phone: '+1-234-567-8910',
    leaveBalance: 10,
  },
]

const SAMPLE_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'LEAVE001',
    employeeName: 'Emma Watson',
    leaveType: 'Annual Leave',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    status: 'pending',
    days: 3,
  },
  {
    id: 'LEAVE002',
    employeeName: 'John Smith',
    leaveType: 'Sick Leave',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    status: 'pending',
    days: 1,
  },
  {
    id: 'LEAVE003',
    employeeName: 'Sarah Johnson',
    leaveType: 'Annual Leave',
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    status: 'pending',
    days: 5,
  },
  {
    id: 'LEAVE004',
    employeeName: 'Michael Chen',
    leaveType: 'Personal Leave',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    status: 'pending',
    days: 2,
  },
  {
    id: 'LEAVE005',
    employeeName: 'Lisa Rodriguez',
    leaveType: 'Annual Leave',
    startDate: '2024-03-10',
    endDate: '2024-03-14',
    status: 'pending',
    days: 5,
  },
]

// Employee Card Component
function EmployeeCardComponent({ employee }: { employee: EmployeeCard }) {
  return (
    <Card className="mb-3 border border-gray-200 bg-white">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.designation}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Building2 className="h-3 w-3" />
                {employee.department}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="h-3 w-3" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="h-3 w-3" />
                {employee.phone}
              </div>
            </div>
            {employee.leaveBalance !== undefined && (
              <div className="mt-2 text-xs">
                <span className="font-semibold text-gray-900">Leave Balance: </span>
                <span className="text-green-600">{employee.leaveBalance} days</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full text-gray-900 border-gray-200 hover:bg-gray-50">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  )
}

// Leave Table Component
function LeaveTableComponent({
  records,
  onApprove,
  onReject,
}: {
  records: LeaveRecord[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Employee Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Leave Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Dates</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Days</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{record.employeeName}</td>
                <td className="px-4 py-3 text-gray-700">{record.leaveType}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-700">{record.days}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={cn(
                      'font-medium',
                      record.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                      record.status === 'approved' && 'bg-green-100 text-green-800',
                      record.status === 'rejected' && 'bg-red-100 text-red-800'
                    )}
                  >
                    {record.status === 'pending' && <Clock className="mr-1 inline h-3 w-3" />}
                    {record.status === 'approved' && <CheckCircle className="mr-1 inline h-3 w-3" />}
                    {record.status === 'rejected' && <XCircle className="mr-1 inline h-3 w-3" />}
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {record.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-gray-200 text-gray-900 hover:bg-gray-50"
                        onClick={() => onApprove?.(record.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-gray-200 text-red-600 hover:bg-gray-50"
                        onClick={() => onReject?.(record.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {record.status !== 'pending' && <span className="text-xs text-gray-500">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Attendance Calendar Component
function AttendanceCalendarComponent({ employeeName, month, year }: { employeeName: string; month: number; year: number }) {
  const [attendanceData] = useState<AttendanceDay[]>([
    { date: '2024-01-01', status: 'present' },
    { date: '2024-01-02', status: 'present' },
    { date: '2024-01-03', status: 'absent' },
    { date: '2024-01-04', status: 'present' },
    { date: '2024-01-05', status: 'half-day' },
    { date: '2024-01-06', status: 'present' },
    { date: '2024-01-07', status: 'present' },
    { date: '2024-01-08', status: 'present' },
    { date: '2024-01-09', status: 'absent' },
    { date: '2024-01-10', status: 'present' },
    { date: '2024-01-11', status: 'present' },
    { date: '2024-01-12', status: 'present' },
    { date: '2024-01-13', status: 'present' },
    { date: '2024-01-14', status: 'present' },
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'present' },
    { date: '2024-01-18', status: 'half-day' },
    { date: '2024-01-19', status: 'present' },
    { date: '2024-01-20', status: 'present' },
    { date: '2024-01-21', status: 'present' },
    { date: '2024-01-22', status: 'present' },
  ])

  const presentDays = attendanceData.filter((d) => d.status === 'present').length
  const absentDays = attendanceData.filter((d) => d.status === 'absent').length
  const halfDays = attendanceData.filter((d) => d.status === 'half-day').length

  return (
    <Card className="mb-4 border border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-sm text-gray-900">Attendance Summary - {employeeName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-xs font-semibold text-gray-600">Present</div>
            <div className="text-lg font-bold text-green-600">{presentDays}</div>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <div className="text-xs font-semibold text-gray-600">Absent</div>
            <div className="text-lg font-bold text-red-600">{absentDays}</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-3">
            <div className="text-xs font-semibold text-gray-600">Half-day</div>
            <div className="text-lg font-bold text-yellow-600">{halfDays}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full gap-2 border-gray-200 text-gray-900 hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </CardContent>
    </Card>
  )
}

// Main Component
export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    action: string
    recordId?: string
    leaveDetails?: LeaveRecord
  }>({ open: false, action: '' })
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(SAMPLE_LEAVE_RECORDS)
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

  const handleApproveLeave = (recordId: string) => {
    const record = leaveRecords.find((r) => r.id === recordId)
    if (record) {
      setConfirmDialog({
        open: true,
        action: 'approve',
        recordId,
        leaveDetails: record,
      })
    }
  }

  const handleRejectLeave = (recordId: string) => {
    const record = leaveRecords.find((r) => r.id === recordId)
    if (record) {
      setConfirmDialog({
        open: true,
        action: 'reject',
        recordId,
        leaveDetails: record,
      })
    }
  }

  const confirmAction = () => {
    if (confirmDialog.recordId) {
      setLeaveRecords((prev) =>
        prev.map((record) =>
          record.id === confirmDialog.recordId
            ? {
                ...record,
                status: confirmDialog.action === 'approve' ? 'approved' : 'rejected',
              }
            : record
        )
      )

      const actionMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Leave request for ${confirmDialog.leaveDetails?.employeeName} has been ${confirmDialog.action === 'approve' ? 'approved' : 'rejected'} successfully.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, actionMessage])
    }
    setConfirmDialog({ open: false, action: '' })
  }

  const getFilteredLeaves = () => {
    let filtered = leaveRecords

    if (selectedDepartment) {
      const deptEmployees = SAMPLE_EMPLOYEES.filter(
        (e) => e.department.toLowerCase() === selectedDepartment.toLowerCase()
      ).map((e) => e.name)
      filtered = filtered.filter((l) => deptEmployees.includes(l.employeeName))
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((l) => selectedStatuses.includes(l.status))
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
          {sidebarOpen && <h1 className="text-lg font-bold text-blue-600">KekaHR</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {[
            { icon: User2, label: 'Dashboard', active: true },
            { icon: Calendar, label: 'Leave Requests' },
            { icon: Filter, label: 'Reports' },
            { icon: Building2, label: 'Departments' },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer',
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
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
                <p className="font-medium text-gray-900">HR Admin</p>
                <p className="text-xs text-gray-600">admin@company.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
          <h2 className="text-xl font-semibold text-gray-900">HR Assistant Dashboard</h2>
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
                    <User2 className="mb-4 h-16 w-16 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900">Welcome to Keka HR Assistant</h3>
                    <p className="mt-2 max-w-md text-sm text-gray-600">
                      Ask me anything about employee data, leave requests, attendance records, or generate reports.
                    </p>
                    <div className="mt-8 grid gap-3 text-left">
                      <p className="text-xs font-semibold text-gray-700">Try asking:</p>
                      <div className="space-y-2">
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "Show all pending leave requests"
                        </div>
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "Get Emma Watson's leave balance"
                        </div>
                        <div className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer">
                          "Show attendance for December 2024"
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'mb-4 flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
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
                            {message.parsedData.query_type === 'leave_inquiry' &&
                              message.parsedData.formatted_data?.type === 'table' && (
                                <LeaveTableComponent
                                  records={leaveRecords.filter((r) => r.status === 'pending')}
                                  onApprove={handleApproveLeave}
                                  onReject={handleRejectLeave}
                                />
                              )}

                            {message.parsedData.query_type === 'employee_search' &&
                              message.parsedData.formatted_data?.type === 'card' && (
                                <div>
                                  {SAMPLE_EMPLOYEES.slice(0, 3).map((emp) => (
                                    <EmployeeCardComponent key={emp.id} employee={emp} />
                                  ))}
                                </div>
                              )}

                            {message.parsedData.query_type === 'attendance_query' &&
                              message.parsedData.formatted_data?.type === 'calendar' && (
                                <AttendanceCalendarComponent employeeName="Emma Watson" month={1} year={2024} />
                              )}

                            {message.parsedData.follow_up_suggestions && (
                              <div className="flex flex-wrap gap-2 pt-3">
                                {message.parsedData.follow_up_suggestions.map(
                                  (suggestion: string, i: number) => (
                                    <button
                                      key={i}
                                      onClick={() => setInput(suggestion)}
                                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                                    >
                                      {suggestion}
                                    </button>
                                  )
                                )}
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
                  placeholder="Ask Keka Assistant..."
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
            <h3 className="mb-4 font-semibold text-gray-900">Quick Filters</h3>

            <div className="space-y-6">
              {/* Department Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-gray-200 text-gray-900">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Status</label>
                <div className="space-y-2">
                  {[
                    { id: 'pending', label: 'Pending', color: 'yellow' },
                    { id: 'approved', label: 'Approved', color: 'green' },
                    { id: 'rejected', label: 'Rejected', color: 'red' },
                  ].map((status) => (
                    <div key={status.id} className="flex items-center gap-2">
                      <Checkbox
                        id={status.id}
                        checked={selectedStatuses.includes(status.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStatuses((prev) => [...prev, status.id])
                          } else {
                            setSelectedStatuses((prev) => prev.filter((s) => s !== status.id))
                          }
                        }}
                      />
                      <label htmlFor={status.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            status.color === 'yellow' && 'bg-yellow-500',
                            status.color === 'green' && 'bg-green-500',
                            status.color === 'red' && 'bg-red-500'
                          )}
                        />
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900">Recent Activity</h4>
                <div className="space-y-2">
                  {getFilteredLeaves()
                    .slice(0, 3)
                    .map((leave) => (
                      <div key={leave.id} className="rounded-lg bg-gray-50 p-3 text-xs">
                        <p className="font-medium text-gray-900">{leave.employeeName}</p>
                        <p className="mt-1 text-gray-600">{leave.leaveType}</p>
                        <p className="mt-1 text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </p>
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: '' })}>
        <DialogContent className="border border-gray-200 bg-white">
          <DialogTitle className="text-gray-900">Confirm Action</DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to {confirmDialog.action} the leave request for{' '}
            <span className="font-semibold">{confirmDialog.leaveDetails?.employeeName}</span>?
          </DialogDescription>
          {confirmDialog.leaveDetails && (
            <div className="my-4 rounded-lg bg-gray-50 p-4 text-sm">
              <div className="mb-2">
                <span className="text-gray-600">Leave Type: </span>
                <span className="font-medium text-gray-900">{confirmDialog.leaveDetails.leaveType}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-600">Dates: </span>
                <span className="font-medium text-gray-900">
                  {new Date(confirmDialog.leaveDetails.startDate).toLocaleDateString()} -{' '}
                  {new Date(confirmDialog.leaveDetails.endDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Days: </span>
                <span className="font-medium text-gray-900">{confirmDialog.leaveDetails.days}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ open: false, action: '' })}
              className="border-gray-200 text-gray-900 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={cn(
                'flex-1 text-white',
                confirmDialog.action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              )}
            >
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
