"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Play, Home as HomeIcon, BookOpen, Code, Trophy, Award, ArrowRight, CheckCircle2, ChevronLeft, Lightbulb } from "lucide-react";
import { COURSE_SECTIONS, EXERCISES, Exercise, Lesson, CourseSection } from "./data";

type Tab = "home" | "lessons" | "lesson_detail" | "sandbox";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeExerciseId, setActiveExerciseId] = useState<string>(EXERCISES[0].id);
  const [activeSectionId, setActiveSectionId] = useState<string>(COURSE_SECTIONS[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(COURSE_SECTIONS[0].lessons[0].id);
  const [expandedSections, setExpandedSections] = useState<string[]>([COURSE_SECTIONS[0].id]);

  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const [isEngineReady, setIsEngineReady] = useState(false);
  const pyodideRef = useRef<any>(null);

  // Sandbox State
  const [sandboxCode, setSandboxCode] = useState(EXERCISES[0].initialCode);
  const [sandboxOutput, setSandboxOutput] = useState("System online. Awaiting command...");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadPythonEngine = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.async = true;
        script.onload = async () => {
          // @ts-ignore
          pyodideRef.current = await window.loadPyodide();
          setIsEngineReady(true);
        };
        document.body.appendChild(script);
      } catch (err) {
        console.error("Failed to load Python Engine", err);
      }
    };
    loadPythonEngine();
  }, []);

  useEffect(() => {
    const activeEx = EXERCISES.find(e => e.id === activeExerciseId);
    if (activeEx) {
      setSandboxCode(activeEx.initialCode);
      setSandboxOutput("Awaiting command...");
    }
  }, [activeExerciseId]);

  // Universal Code Runner
  const executeCode = async (codeToRun: string): Promise<string> => {
    if (!isEngineReady || !pyodideRef.current) return "Engine not ready.";
    try {
      let currentOutput = "";
      pyodideRef.current.setStdout({
        batched: (msg: string) => { currentOutput += msg + "\n"; },
      });
      await pyodideRef.current.runPythonAsync(codeToRun);
      return currentOutput.trim() || "✅ Executed (No output)";
    } catch (err: any) {
      return `⚠️ SYSTEM ERROR:\n${err.message}`;
    }
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>, code: string, setCode: (c: string) => void) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 4; }, 0);
    }
  };

  const runSandboxCode = async () => {
    setIsRunning(true);
    setSandboxOutput("Executing sequence...\n");
    const result = await executeCode(sandboxCode);
    setSandboxOutput(result);
    
    const activeEx = EXERCISES.find(e => e.id === activeExerciseId);
    if (activeEx && result === activeEx.expectedOutput) {
      handleExerciseSuccess(activeEx);
    }
    setIsRunning(false);
  };

  const handleExerciseSuccess = (exercise: Exercise) => {
    if (!completedExercises.includes(exercise.id)) {
      const newCompleted = [...completedExercises, exercise.id];
      setCompletedExercises(newCompleted);
      setPoints(prev => prev + exercise.points);

      // Check section completion for badge
      let earnedBadge = null;
      for (const section of COURSE_SECTIONS) {
        const sectionExIds = section.lessons.flatMap(l => l.linkedExerciseIds);
        if (sectionExIds.includes(exercise.id)) {
          // Check if all are completed
          const allCompleted = sectionExIds.every(id => newCompleted.includes(id));
          if (allCompleted && !badges.includes(section.badgeToUnlock)) {
            setBadges(prev => [...prev, section.badgeToUnlock]);
            earnedBadge = section.badgeToUnlock;
          }
          break;
        }
      }

      let successMsg = `\n\n🎉 SUCCESS! Mission Accomplished.\n+${exercise.points} Points Earned!`;
      if (earnedBadge) {
        successMsg += `\n\n🏅 ACHIEVEMENT UNLOCKED: ${earnedBadge} Section Completed!`;
      }
      setSandboxOutput(prev => prev + successMsg);
    } else {
      setSandboxOutput(prev => prev + `\n\n✅ Mission Accomplished (Already completed).`);
    }
  };

  const openLesson = (sectionId: string, lessonId: string) => {
    setActiveSectionId(sectionId);
    setActiveLessonId(lessonId);
    setActiveTab("lesson_detail");
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const openExercise = (exerciseId: string) => {
    setActiveExerciseId(exerciseId);
    setActiveTab("sandbox");
  };

  const goToNextLesson = () => {
    let currentSecIdx = -1;
    let currentLesIdx = -1;
    
    COURSE_SECTIONS.forEach((sec, sIdx) => {
      const lIdx = sec.lessons.findIndex(l => l.id === activeLessonId);
      if (lIdx !== -1) {
        currentSecIdx = sIdx;
        currentLesIdx = lIdx;
      }
    });

    if (currentSecIdx !== -1 && currentLesIdx !== -1) {
      const currentSection = COURSE_SECTIONS[currentSecIdx];
      if (currentLesIdx < currentSection.lessons.length - 1) {
        // Next lesson in same section
        setActiveLessonId(currentSection.lessons[currentLesIdx + 1].id);
      } else if (currentSecIdx < COURSE_SECTIONS.length - 1) {
        // First lesson of next section
        const nextSection = COURSE_SECTIONS[currentSecIdx + 1];
        setActiveSectionId(nextSection.id);
        setActiveLessonId(nextSection.lessons[0].id);
      }
    }
  };

  // Internal Component for Inline Lesson Editors
  const InlineEditor = ({ initialCode }: { initialCode: string }) => {
    const [localCode, setLocalCode] = useState(initialCode);
    const [localOutput, setLocalOutput] = useState("");
    const [isLocalRunning, setIsLocalRunning] = useState(false);

    const runLocal = async () => {
      setIsLocalRunning(true);
      const res = await executeCode(localCode);
      setLocalOutput(res);
      setIsLocalRunning(false);
    };

    return (
      <div className="bg-[#0d1117] rounded-xl border border-slate-700 overflow-hidden my-4 shadow-lg">
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-mono">Interactive Sandbox</span>
          <button 
            onClick={runLocal} 
            disabled={!isEngineReady || isLocalRunning}
            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded font-bold disabled:opacity-50"
          >
            {isLocalRunning ? "Running..." : "Run"}
          </button>
        </div>
        <textarea
          value={localCode}
          onChange={(e) => setLocalCode(e.target.value)}
          onKeyDown={(e) => handleTabKey(e, localCode, setLocalCode)}
          className="w-full h-32 bg-transparent text-green-400 font-mono p-4 focus:outline-none resize-none text-sm"
          spellCheck="false"
        />
        {localOutput && (
          <div className="bg-black p-3 text-xs font-mono border-t border-slate-800 text-cyan-300 whitespace-pre-wrap">
            {localOutput.includes("ERROR") ? <span className="text-red-400">{localOutput}</span> : localOutput}
          </div>
        )}
      </div>
    );
  };

  // Helper to find current lesson
  const currentSection = COURSE_SECTIONS.find(s => s.id === activeSectionId);
  const currentLesson = currentSection?.lessons.find(l => l.id === activeLessonId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hidden md:block">
            SPACE PYTHON ACADEMY
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("home")} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-800 text-slate-400'}`}>
              <HomeIcon className="w-4 h-4" /> Home
            </button>
            <button onClick={() => setActiveTab("lessons")} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'lessons' || activeTab === 'lesson_detail' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-800 text-slate-400'}`}>
              <BookOpen className="w-4 h-4" /> Curriculum
            </button>
            <button onClick={() => setActiveTab("sandbox")} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === 'sandbox' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Code className="w-4 h-4" /> Sandbox
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Trophy className="w-4 h-4" /> {points} PTS
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Award className="w-4 h-4" /> {badges.length} Badges
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* HOME TAB */}
        {activeTab === "home" && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 animate-in fade-in duration-500">
            <div className="bg-cyan-500/10 p-6 rounded-full border border-cyan-500/30">
              <Trophy className="w-20 h-20 text-cyan-400" />
            </div>
            <h2 className="text-5xl font-extrabold text-white">Welcome, Cadet!</h2>
            <p className="text-xl text-slate-400 max-w-2xl">Complete interactive lessons, write real Python code, and earn badges to become a Space Python Master.</p>
            <button onClick={() => setActiveTab("lessons")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2">
              Access Terminal <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* LESSONS DIRECTORY TAB */}
        {activeTab === "lessons" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-8 text-white">Curriculum Modules</h2>
            <div className="flex flex-col gap-6">
              {COURSE_SECTIONS.map((section) => (
                <div key={section.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div 
                    className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-cyan-300">{section.title}</h3>
                      <p className="text-slate-400 mt-1">{section.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {badges.includes(section.badgeToUnlock) ? (
                        <div className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked: {section.badgeName}
                        </div>
                      ) : (
                        <div className="text-xs font-bold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                          Reward: {section.badgeName}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="bg-slate-950 p-6 border-t border-slate-800 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {section.lessons.map(lesson => (
                        <div key={lesson.id} onClick={() => openLesson(section.id, lesson.id)} className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800 transition-all group shadow-md">
                          <h4 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-400">{lesson.title}</h4>
                          <p className="text-slate-400 text-xs flex-1">{lesson.description}</p>
                          <div className="mt-4 flex items-center text-cyan-600 text-xs font-bold gap-2">
                            Enter Lesson <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LESSON DETAIL TAB */}
        {activeTab === "lesson_detail" && currentLesson && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setActiveTab("lessons")} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Curriculum
            </button>
            
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-8 border-b border-slate-800 pb-4">{currentLesson.title}</h2>
              
              <div className="space-y-8">
                {currentLesson.sections.map((section) => (
                  <div key={section.id}>
                    {section.type === "text" ? (
                      <div className="prose prose-invert max-w-none">
                        {section.heading && <h3 className="text-2xl font-bold text-cyan-300 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400"/> {section.heading}</h3>}
                        <p className="text-slate-300 leading-relaxed text-lg mt-2">{section.content}</p>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 p-6 rounded-2xl border border-cyan-900/50">
                        <p className="text-slate-300 mb-4">{section.content}</p>
                        <InlineEditor initialCode={section.initialCode || ""} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Steps Footer */}
              <div className="mt-12 p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">Practice Missions</h4>
                  <p className="text-sm text-slate-400">Complete missions to earn the section badge.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {currentLesson.linkedExerciseIds.map(exId => {
                      const ex = EXERCISES.find(e => e.id === exId);
                      if (!ex) return null;
                      const isCompleted = completedExercises.includes(ex.id);
                      return (
                        <button key={ex.id} onClick={() => openExercise(ex.id)} className={`flex items-center justify-between gap-4 px-4 py-2 rounded-lg font-bold transition-all ${isCompleted ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
                          <span className="flex items-center gap-2"><Code className="w-4 h-4" /> {ex.title}</span>
                          {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Next Lesson Button Logic */}
                  <button onClick={goToNextLesson} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all h-full mt-2 sm:mt-0">
                    Next Lesson <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SANDBOX TAB */}
        {activeTab === "sandbox" && (
          <div className="grid lg:grid-cols-3 gap-6 h-[75vh] animate-in slide-in-from-right-8 duration-500">
            {/* Exercise Instructions Sidebar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto shadow-lg">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Select Mission</h3>
                <select 
                  value={activeExerciseId}
                  onChange={(e) => setActiveExerciseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-cyan-300 outline-none focus:border-cyan-500"
                >
                  {COURSE_SECTIONS.map(sec => (
                    <optgroup key={sec.id} label={sec.title}>
                      {sec.lessons.map(les => (
                        les.linkedExerciseIds.map(exId => {
                          const ex = EXERCISES.find(e => e.id === exId);
                          if (!ex) return null;
                          return <option key={ex.id} value={ex.id}>{les.title} - {ex.title}</option>
                        })
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {EXERCISES.map(ex => ex.id === activeExerciseId && (
                <div key={ex.id} className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-white">{ex.title}</h2>
                    {completedExercises.includes(ex.id) && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  </div>
                  <div className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-yellow-500/30">
                    Reward: {ex.points} PTS
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <h4 className="text-xs uppercase text-slate-500 font-bold mb-2">Mission Brief</h4>
                    <p className="text-slate-300 leading-relaxed">{ex.instructions}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Editor & Terminal */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex-1 bg-[#0d1117] rounded-2xl border border-slate-800 flex flex-col overflow-hidden focus-within:border-cyan-500/50 transition-colors shadow-2xl">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400">main.py</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${isEngineReady ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                      {isEngineReady ? 'Engine Ready' : 'Booting...'}
                    </span>
                    <button onClick={runSandboxCode} disabled={!isEngineReady || isRunning} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-1.5 rounded-md text-sm font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)] disabled:opacity-50">
                      <Play className="w-4 h-4" /> {isRunning ? "Running..." : "Execute"}
                    </button>
                  </div>
                </div>
                <textarea
                  value={sandboxCode}
                  onChange={(e) => setSandboxCode(e.target.value)}
                  onKeyDown={(e) => handleTabKey(e, sandboxCode, setSandboxCode)}
                  className="w-full h-full bg-transparent text-green-400 font-mono p-5 focus:outline-none resize-none text-base selection:bg-slate-700"
                  spellCheck="false"
                  placeholder="Type your Python code here..."
                />
              </div>

              <div className="h-48 bg-black rounded-2xl border border-slate-800 p-4 font-mono text-sm overflow-y-auto shadow-inner">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs uppercase">Terminal Output</span>
                </div>
                <pre className={`whitespace-pre-wrap ${sandboxOutput.includes('ERROR') ? 'text-red-400' : 'text-cyan-300'}`}>
                  {sandboxOutput}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}