import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dtnthpwvvgsvapbfjcmq.supabase.co' // 본인 프로젝트 URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bnRocHd2dmdzdmFwYmZqY21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzQ3MzUsImV4cCI6MjA2MDIxMDczNX0.kHA-3N_UXEOJMX2gEPMoN9r8LKjnof4MY-yneg9hfuw' // anon public key

export const supabase = createClient(supabaseUrl, supabaseKey)
