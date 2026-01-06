import React, { useState } from 'react';
import { debugSupabase } from '../debug/supabaseTest.js';

const DebugPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState('');

  const runDebug = async () => {
    setIsRunning(true);
    setResults('');
    
    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    let output = '';
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      output += message + '\n';
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      output += '❌ ' + message + '\n';
      originalError(...args);
    };
    
    try {
      await debugSupabase();
    } catch (error) {
      output += `\n❌ Debug failed: ${error.message}\n`;
    }
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    setResults(output);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-800 mb-4">🔍 Supabase Debug Tool</h1>
          <p className="text-secondary-600 mb-6">
            This tool will test your Supabase connection, table access, and RLS policies to identify CRUD issues.
          </p>
          
          <button
            onClick={runDebug}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent-600'
            }`}
          >
            {isRunning ? '🔄 Running Debug...' : '🚀 Run Debug Test'}
          </button>
        </div>

        {results && (
          <div className="bg-gray-900 text-green-400 rounded-xl p-6 font-mono text-sm overflow-auto max-h-96">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Debug Results</h2>
              <button
                onClick={() => navigator.clipboard.writeText(results)}
                className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600"
              >
                Copy Results
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{results}</pre>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 What This Tests</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• Environment variables configuration</li>
            <li>• Supabase connection and authentication</li>
            <li>• Table existence and structure</li>
            <li>• Row Level Security (RLS) policies</li>
            <li>• SELECT, INSERT operations</li>
            <li>• Data visibility for projects and blogs</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Common Issues</h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• <strong>Connection failed:</strong> Check .env file and Supabase URL/key</li>
            <li>• <strong>Table does not exist:</strong> Run SUPABASE_SETUP.md SQL first</li>
            <li>• <strong>RLS policy violation:</strong> Run SUPABASE_FIX.sql to update policies</li>
            <li>• <strong>Empty results:</strong> Add test data directly in Supabase dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
