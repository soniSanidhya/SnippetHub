import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";

export default function CodeEditor({ 
  value, 
  onChange, 
  language = "javascript",
  height = "400px",
  readOnly = false,
  preview = false
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 rounded-lg" style={{ height }}></div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: !preview },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: readOnly,
          domReadOnly: readOnly,
          contextmenu: !readOnly,
          quickSuggestions: !readOnly,
          suggestOnTriggerCharacters: !readOnly,
          parameterHints: !readOnly,
          folding: !preview,
          renderLineHighlight: preview ? "none" : "all",
        }}
      />
    </div>
  );
}