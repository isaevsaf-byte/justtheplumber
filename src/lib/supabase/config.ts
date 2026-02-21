// These are public values — the anon key is designed to be exposed in client-side code.
// Using constants ensures they're available at build time on Vercel.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kyzatmyeevzgkvfguiyq.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5emF0bXllZXZ6Z2t2Zmd1aXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjg5NDMsImV4cCI6MjA4NjkwNDk0M30.tHSnkS4QxDviicfEb3fdPcwwIq6T9HWlzl7Ij0jqlZk';
