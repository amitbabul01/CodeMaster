import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";

const langMap = {
  javascript: 'javascript',
  python: 'python'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  // Fetch problem
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(res.data);

        const initialCode =
          res.data.startCode.find(sc => sc.language === langMap[selectedLanguage])
            ?.initialCode || '';

        setCode(initialCode);
      } catch (err) {
        console.error("Problem fetch failed:", err);
      }
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  // Change starter code when switching language
  useEffect(() => {
    if (!problem) return;

    const initialCode =
      problem.startCode.find(sc => sc.language === langMap[selectedLanguage])
        ?.initialCode || '';

    setCode(initialCode);
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);

  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(res.data);
    } catch (err) {
      console.error("Run error:", err);
      setRunResult({ success: false, error: "Internal server error" });
    }

    setLoading(false);
    setActiveRightTab("testcase");
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setSubmitResult(res.data);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitResult({ accepted: false, error: "Submission failed" });
    }

    setLoading(false);
    setActiveRightTab("result");
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (d) => {
    switch (d) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-height-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* LEFT PANEL */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('description')}>Description</button>
          <button className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('editorial')}>Editorial</button>
          <button className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('solutions')}>Solutions</button>
          <button className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`} onClick={() => setActiveLeftTab('submissions')}>Submissions</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty?.[0]?.toUpperCase() + problem.difficulty?.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="whitespace-pre-wrap text-sm">
                    {problem.description}
                  </div>

                  <h3 className="mt-6 font-semibold">Examples</h3>
                  {problem.visibleTestCases?.map((ex, i) => (
                    <div key={i} className="bg-base-200 p-3 mt-2 rounded">
                      <div><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      <div><strong>Explanation:</strong> {ex.explanation}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="whitespace-pre-wrap text-sm">
                  Editorial will appear here.
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h3 className="font-semibold mb-2">Solutions</h3>
                  {(problem.referenceSolution || []).map((s, i) => (
                    <pre key={i} className="bg-base-200 p-3 rounded text-xs overflow-x-auto">
                      {s.completeCode}
                    </pre>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex flex-col">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('code')}>Code</button>
          <button className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('testcase')}>Testcase</button>
          <button className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`} onClick={() => setActiveRightTab('result')}>Result</button>
        </div>

        {activeRightTab === 'code' && (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex gap-2">
              {['javascript', 'python'].map(lang => (
                <button
                  key={lang}
                  className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang === 'javascript' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>

            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
            />

            <div className="p-4 flex justify-end gap-2 border-t">
              <button className="btn btn-outline btn-sm" disabled={loading} onClick={handleRun}>Run</button>
              <button className="btn btn-primary btn-sm" disabled={loading} onClick={handleSubmitCode}>Submit</button>
            </div>
          </div>
        )}

        {activeRightTab === 'testcase' && (
          <div className="p-4 overflow-y-auto text-sm">
            {runResult ? JSON.stringify(runResult, null, 2) : "Run code to see results"}
          </div>
        )}

        {activeRightTab === 'result' && (
          <div className="p-4 overflow-y-auto text-sm">
            {submitResult ? JSON.stringify(submitResult, null, 2) : "Submit code to see result"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
