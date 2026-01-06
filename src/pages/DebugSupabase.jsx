// Quick Supabase Diagnostic Page
// Navigate to /debug-supabase to see connection status
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DebugSupabase = () => {
  const [results, setResults] = useState({
    configured: false,
    blogsRead: null,
    blogsWrite: null,
    projectsRead: null,
    projectsWrite: null,
    skillsRead: null,
    skillsWrite: null,
    tables: null,
  });
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const newResults = { ...results };

    // Test 1: Configuration
    newResults.configured = isSupabaseConfigured();
    console.log('Supabase configured:', newResults.configured);

    if (!newResults.configured) {
      setResults(newResults);
      setLoading(false);
      return;
    }

    // Test 2: Read blogs
    try {
      const { data, error } = await supabase.from('blogs').select('*').limit(1);
      newResults.blogsRead = { success: !error, data, error };
      console.log('Blogs read test:', newResults.blogsRead);
    } catch (err) {
      newResults.blogsRead = { success: false, error: err.message };
    }

    // Test 3: Write blogs (insert test)
    try {
      const testBlog = {
        title: 'Test Blog ' + Date.now(),
        slug: 'test-blog-' + Date.now(),
        content: 'Test content',
        excerpt: 'Test excerpt',
        status: 'draft',
        featured: false,
      };
      const { data, error } = await supabase
        .from('blogs')
        .insert([testBlog])
        .select()
        .single();
      
      newResults.blogsWrite = { success: !error, data, error };
      console.log('Blogs write test:', newResults.blogsWrite);

      // Clean up test blog if successful
      if (!error && data?.id) {
        await supabase.from('blogs').delete().eq('id', data.id);
      }
    } catch (err) {
      newResults.blogsWrite = { success: false, error: err.message };
    }

    // Test 4: Read projects
    try {
      const { data, error } = await supabase.from('projects').select('*').limit(1);
      newResults.projectsRead = { success: !error, data, error };
      console.log('Projects read test:', newResults.projectsRead);
    } catch (err) {
      newResults.projectsRead = { success: false, error: err.message };
    }

    // Test 5: Write projects (insert test)
    try {
      const testProject = {
        title: 'Test Project ' + Date.now(),
        description: 'Test description',
        category: 'Test',
        technologies: ['Test'],
        publishing_status: 'draft',
        featured: false,
      };
      const { data, error } = await supabase
        .from('projects')
        .insert([testProject])
        .select()
        .single();
      
      newResults.projectsWrite = { success: !error, data, error };
      console.log('Projects write test:', newResults.projectsWrite);

      // Clean up test project if successful
      if (!error && data?.id) {
        await supabase.from('projects').delete().eq('id', data.id);
      }
    } catch (err) {
      newResults.projectsWrite = { success: false, error: err.message };
    }

    // Test 6: Read skills (working reference)
    try {
      const { data, error } = await supabase.from('skills').select('*').limit(1);
      newResults.skillsRead = { success: !error, data, error };
      console.log('Skills read test:', newResults.skillsRead);
    } catch (err) {
      newResults.skillsRead = { success: false, error: err.message };
    }

    // Test 7: List all tables
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      newResults.tables = { success: !error, data, error };
    } catch (err) {
      // Fallback: just list known tables
      newResults.tables = { 
        success: false, 
        note: 'Cannot query schema, using manual check',
        error: err.message 
      };
    }

    setResults(newResults);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const ResultCard = ({ title, result, testType }) => {
    if (!result) return null;

    const isSuccess = result.success;
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';

    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-4`}>
        <h3 className={`font-bold text-lg ${textColor} mb-2`}>
          {isSuccess ? '✅' : '❌'} {title}
        </h3>
        {result.error && (
          <div className="mt-2">
            <p className="font-semibold text-red-700">Error:</p>
            <pre className="text-sm bg-white p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(result.error, null, 2)}
            </pre>
          </div>
        )}
        {result.note && (
          <p className="text-sm text-gray-600 mt-2">{result.note}</p>
        )}
        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-semibold">
            View Details
          </summary>
          <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Supabase Connection Diagnostic
          </h1>
          <p className="text-gray-600 mb-6">
            Testing Supabase connection and permissions for blogs, projects, and skills tables
          </p>

          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
          >
            {loading ? 'Running Tests...' : '🔄 Re-run Tests'}
          </button>

          <div className="space-y-4">
            <ResultCard
              title="Supabase Configuration"
              result={{ success: results.configured }}
              testType="config"
            />
            
            {results.configured && (
              <>
                <ResultCard title="Blogs - Read Test" result={results.blogsRead} />
                <ResultCard title="Blogs - Write Test" result={results.blogsWrite} />
                <ResultCard title="Projects - Read Test" result={results.projectsRead} />
                <ResultCard title="Projects - Write Test" result={results.projectsWrite} />
                <ResultCard title="Skills - Read Test (Reference)" result={results.skillsRead} />
              </>
            )}
          </div>

          {!results.configured && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Supabase Not Configured</h3>
              <p className="text-yellow-700">
                Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">💡 What to Look For:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• ❌ <strong>Read fails</strong> → Table doesn't exist or connection issue</li>
              <li>• ✅ <strong>Read succeeds, Write fails</strong> → RLS policy blocking writes</li>
              <li>• ✅ <strong>Both succeed</strong> → Frontend code issue, not Supabase</li>
              <li>• 📝 Check browser console (F12) for detailed error logs</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">🔧 Quick Fixes:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• If write fails: Run <code className="bg-white px-2 py-1 rounded">FIX_RLS_POLICIES.sql</code></li>
              <li>• If read fails: Check table exists in Supabase Dashboard</li>
              <li>• If config fails: Check <code className="bg-white px-2 py-1 rounded">.env</code> file</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;
