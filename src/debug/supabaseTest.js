// Debug script to test Supabase connection and operations
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const debugSupabase = async () => {
  console.log('🔍 DEBUGGING SUPABASE CONNECTION AND OPERATIONS');
  console.log('================================================');
  
  // 1. Check configuration
  console.log('1. Configuration Check:');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
  console.log('Is configured:', isSupabaseConfigured());
  console.log('');

  // 2. Test basic connection
  console.log('2. Testing Basic Connection:');
  try {
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    } else {
      console.log('✅ Connection successful, projects count:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err);
    return false;
  }
  console.log('');

  // 3. Test table existence and structure
  console.log('3. Testing Table Structure:');
  const tables = ['projects', 'blogs', 'skill_categories', 'skills', 'tech_stack'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ ${table}:`, error.message);
      } else {
        console.log(`✅ ${table}: exists, sample data:`, data.length > 0 ? 'has data' : 'empty');
        if (data.length > 0) {
          console.log(`   Sample columns:`, Object.keys(data[0]).join(', '));
        }
      }
    } catch (err) {
      console.error(`❌ ${table} error:`, err.message);
    }
  }
  console.log('');

  // 4. Test RLS policies by attempting operations
  console.log('4. Testing RLS Policies:');
  
  // Test SELECT on projects
  try {
    const { data, error } = await supabase.from('projects').select('id, title, publishing_status').limit(5);
    if (error) {
      console.error('❌ Projects SELECT failed:', error.message);
    } else {
      console.log('✅ Projects SELECT success:', data.length, 'records');
      data.forEach(p => console.log(`   - ${p.title} (${p.publishing_status})`));
    }
  } catch (err) {
    console.error('❌ Projects SELECT error:', err.message);
  }

  // Test SELECT on blogs  
  try {
    const { data, error } = await supabase.from('blogs').select('id, title, status').limit(5);
    if (error) {
      console.error('❌ Blogs SELECT failed:', error.message);
    } else {
      console.log('✅ Blogs SELECT success:', data.length, 'records');
      data.forEach(b => console.log(`   - ${b.title} (${b.status})`));
    }
  } catch (err) {
    console.error('❌ Blogs SELECT error:', err.message);
  }
  console.log('');

  // 5. Test INSERT operations
  console.log('5. Testing INSERT Operations:');
  
  // Test project insert
  try {
    const testProject = {
      title: 'Debug Test Project',
      description: 'Test project for debugging',
      category: 'Test',
      project_type: 'Debug',
      status: 'draft',
      publishing_status: 'draft',
      visibility: 'public',
      featured: false
    };
    
    const { data, error } = await supabase.from('projects').insert([testProject]).select().single();
    if (error) {
      console.error('❌ Project INSERT failed:', error.message);
    } else {
      console.log('✅ Project INSERT success:', data.id);
      
      // Clean up - delete the test project
      await supabase.from('projects').delete().eq('id', data.id);
      console.log('   (Test project cleaned up)');
    }
  } catch (err) {
    console.error('❌ Project INSERT error:', err.message);
  }

  // Test blog insert
  try {
    const testBlog = {
      title: 'Debug Test Blog',
      slug: 'debug-test-blog-' + Date.now(),
      content: 'Test blog content for debugging',
      excerpt: 'Test excerpt',
      status: 'draft',
      featured: false
    };
    
    const { data, error } = await supabase.from('blogs').insert([testBlog]).select().single();
    if (error) {
      console.error('❌ Blog INSERT failed:', error.message);
    } else {
      console.log('✅ Blog INSERT success:', data.id);
      
      // Clean up - delete the test blog
      await supabase.from('blogs').delete().eq('id', data.id);
      console.log('   (Test blog cleaned up)');
    }
  } catch (err) {
    console.error('❌ Blog INSERT error:', err.message);
  }
  console.log('');

  // 6. Check current policies
  console.log('6. Current RLS Policies:');
  try {
    const { data, error } = await supabase.rpc('get_policies');
    if (error && !error.message.includes('function get_policies() does not exist')) {
      console.error('❌ Policy check failed:', error.message);
    } else if (error) {
      console.log('ℹ️  Custom policy function not available, checking manually...');
      
      // Manual policy check via direct query (if we have permissions)
      try {
        const query = `
          SELECT schemaname, tablename, policyname, cmd, permissive
          FROM pg_policies 
          WHERE schemaname = 'public' 
          AND tablename IN ('projects', 'blogs')
          ORDER BY tablename, cmd;
        `;
        const { data: policies, error: policyError } = await supabase.rpc('sql', { query });
        if (policyError) {
          console.log('ℹ️  Cannot check policies directly (normal for anon users)');
        } else {
          console.log('✅ Current policies:', policies);
        }
      } catch (policyErr) {
        console.log('ℹ️  Policy inspection not available with current permissions');
      }
    } else {
      console.log('✅ Policies:', data);
    }
  } catch (err) {
    console.log('ℹ️  Policy check not available:', err.message);
  }

  console.log('');
  console.log('🏁 Debug complete! Check the results above.');
  return true;
};

// Helper function to run debug from console
window.debugSupabase = debugSupabase;
