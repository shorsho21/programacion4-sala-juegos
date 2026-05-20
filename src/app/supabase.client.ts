import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyjrhqhuoketqhdcjbiu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5anJocWh1b2tldHFoZGNqYml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTg4NTgsImV4cCI6MjA5NDc5NDg1OH0.MsckSyEw6lvteIbbFnxKo3V9GpfIzeYIHNwTD8x7ZXc';

export const supabase = createClient(supabaseUrl, supabaseKey);