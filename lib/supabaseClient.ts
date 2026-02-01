import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypnnskopsoljsfchzzkx.supabase.co';
const supabaseKey = 'sb_publishable_F0wrmtW2XCZRaj2o8qSmhw_lXF4dYZY';

export const supabase = createClient(supabaseUrl, supabaseKey);