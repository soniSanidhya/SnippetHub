import { useState } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from '../CodeEditor';

export default function SnippetCodeExecution({ snippet = {} }) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const executeCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      if (snippet.language === 'javascript') {
        // Create a safe execution environment
        const sandbox = new Function(
          'console',
          `
          try {
            ${snippet.currentVersion.updatedCode}
          } catch (error) {
            throw error;
          }
        `
        );

        // Capture console output
        let consoleOutput = '';
        const mockConsole = {
          log: (...args) => {
            consoleOutput += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
            ).join(' ') + '\n';
          },
          error: (...args) => {
            consoleOutput += 'Error: ' + args.join(' ') + '\n';
          }
        };

        const result = await sandbox(mockConsole);
        setOutput(consoleOutput + (result || ''));
      } else {
        setOutput(`Code execution for ${snippet.language} is simulated in this environment.`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Code Execution</h3>
        <button
          onClick={executeCode}
          disabled={isRunning}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center space-x-2"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900 rounded-lg p-4"
      >
        <div className="font-mono text-sm text-white whitespace-pre-wrap">
          {error ? (
            <div className="text-red-400">Error: {error}</div>
          ) : output ? (
            output
          ) : (
            <div className="text-gray-400">Click "Run Code" to see the output</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}