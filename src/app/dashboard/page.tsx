import { redirect } from 'next/navigation'
// The middleware handles the redirect to /client, /therapist, or /admin
// This page exists only as a fallback
export default function DashboardPage() {
  redirect('/')
}
