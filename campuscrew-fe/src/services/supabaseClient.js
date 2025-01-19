import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://izaiemjxotvagkkhjwqz.supabase.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6YWllbWp4b3R2YWdra2hqd3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1OTQzMjEsImV4cCI6MjA0NjE3MDMyMX0.CtSxJkEtjS8yx2ighR4Wu8eF41kuONy_72tVzLhcT9s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
