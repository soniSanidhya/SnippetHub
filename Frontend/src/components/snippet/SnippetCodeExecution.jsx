import { motion } from 'framer-motion';
import LZString from 'lz-string';

export default function SnippetCodeExecution({ snippet = {} }) {
  const redirectToCodesandbox = () => {
    const { code = '', language = 'javascript' } = snippet;

    // If there's no code, simply redirect to CodeSandbox homepage.
    if (!code.trim()) {
      window.open('https://codesandbox.io/s', '_blank');
      return;
    }

    // Set file name based on language.
    const filename = language.toLowerCase().includes('jsx') ? 'index.jsx' : 'index.js';

    // Prepare the files structure for CodeSandbox.
    const files = {
      [filename]: { content: code },
      'package.json': {
        content: JSON.stringify({
          name: 'codesandbox-embed',
          version: '1.0.0',
          main: filename,
          dependencies: {}
        })
      }
    };

    // Generate the parameters using lz-string.
    const parameters = LZString.compressToBase64(JSON.stringify({ files }));

    // Redirect to CodeSandbox with the provided parameters.
    window.open(
      `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Code Execution
        </h3>
        <button
          onClick={redirectToCodesandbox}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Try it Yourself</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900 rounded-lg p-4"
      >
        <div className="font-mono text-sm text-white whitespace-pre-wrap">
          <div className="text-gray-400">
            You will be redirected to CodeSandbox to try out the code.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
