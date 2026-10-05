import { useEffect, useMemo, useRef, useState } from "react";
import PoseIllustration from "./PoseIllustration.jsx";
import {
  ArrowRight, AudioLines, BadgeCheck, BookOpen, Check,
  ChevronDown, CircleHelp, Clock3, Flower2, Pause, Play, Search, Send,
  Settings, ShieldCheck, Sparkles, Sun, Volume2, VolumeX, X,
} from "lucide-react";
import poseData from "../data/poses.json";
import routineData from "../data/routines.json";

const QUICK_STARTS = [
  { label: "Quick 5-min stretch", icon: "☀️", goal: "Flexibility and mobility" },
  { label: "Relax / Stress relief", icon: "☁️", goal: "Stress and anxiety relief" },
  { label: "Weight loss flow", icon: "🌿", goal: "Weight loss and fat burning" },
  { label: "Headache relief", icon: "🌙", goal: "Headache and migraine relief" },
];
const tabs = [
  { id: "home", label: "Home", icon: Sun },
  { id: "chat", label: "Chat", icon: AudioLines },
  { id: "explore", label: "Explore", icon: Flower2 },
  { id: "progress", label: "Progress", icon: BadgeCheck },
];
const safeQuickReply = (text) => {
  const lower = text.toLowerCase();
  if (/headache|head hurts|migraine/.test(lower)) {
    return "I'm sorry your head is hurting. If it's sudden or unusually severe, or comes with vision changes, weakness, or confusion, seek urgent medical care. For a persistent or recurring headache, please check with a clinician. If it feels like ordinary tension, try quiet rest and gentle shoulder rolls—skip inversions, and stop if symptoms worsen.";
  }
  if (/stress|anx|relax|overwhelm/.test(lower)) {
    return "Let's take the pressure off. Find a comfortable seat and let your shoulders soften. If it feels okay, take three easy breaths—no need to make them extra deep. Would you like a 5-minute gentle reset? If anxiety feels persistent, talking with someone you trust or a professional can help.";
  }
  if (/weight|fat|burn/.test(lower)) {
    return "We can choose a friendly, energising movement session—without pressure. Yoga supports movement and wellbeing, but it can't target fat loss in one area. How much time and energy do you have today? Any pain, injury, pregnancy, blood-pressure concern, or other condition to keep in mind?";
  }
  return "I'm here with you. Before I suggest a flow, how are your mood and energy, how much time do you have, and is there any pain or movement you'd like to avoid? You can skip anything you'd rather not share.";
};
const findMentionedPoses = (text) => {
  const lower = text.toLowerCase();
  return poseData.poses
    .filter((pose) => lower.includes(pose.name.toLowerCase()) || lower.includes(pose.sanskrit.toLowerCase()))
    .slice(0, 2);
};
const getRoutine = (goal) =>
  routineData.programs.find((item) => item.goal === goal) ?? routineData.programs[0];
const getGuidance = (label) => {
  const value = label.toLowerCase();
  const findPose = (...names) => poseData.poses.find((pose) =>
    names.some((name) => pose.name.toLowerCase() === name.toLowerCase() || pose.sanskrit.toLowerCase() === name.toLowerCase()),
  );
  const guided = [
    { match: /surya namaskar|sun salutation/, pose: findPose("Surya Namaskar") },
    { match: /warrior ii|virabhadrasana ii/, pose: findPose("Warrior II") },
    { match: /warrior i\b|virabhadrasana i\b/, pose: findPose("Warrior I") },
    { match: /tree pose|vrikshasana/, pose: findPose("Tree Pose") },
    { match: /child'?s pose|balasana/, pose: findPose("Child's Pose") },
    { match: /bound angle|baddha konasana/, pose: findPose("Bound Angle Pose") },
    { match: /bridge pose|setu bandhasana/, pose: findPose("Bridge Pose") },
    { match: /cobra|bhujangasana/, pose: findPose("Cobra Pose") },
    { match: /downward.?facing dog|adho mukha/, pose: findPose("Downward-Facing Dog") },
    { match: /legs.up|legs on (a )?chair|viparita/, pose: findPose("Legs-Up-the-Wall") },
    { match: /mountain|tadasana|standing/, pose: findPose("Mountain Pose") },
    { match: /chair pose|utkatasana/, pose: findPose("Chair Pose") },
    { match: /forward fold|uttanasana/, pose: findPose("Standing Forward Fold") },
    { match: /body scan|shavasana|corpse|rest|quiet|cool.down/, pose: findPose("Corpse Pose") },
    { match: /forward rest|seated forward|seated fold/, pose: findPose("Seated Forward Bend") },
    { match: /chair chest|chest opener/, pose: findPose("Easy Pose") },
    { match: /cat.?cow/, pose: findPose("Cat-Cow") },
    { match: /shoulder|neck|wrist|eye|screen|look away/, pose: findPose("Easy Pose") },
    { match: /warm.up|joint warm|mobility|walk|movement|stretch|side stretch/, pose: findPose("Mountain Pose") },
    { match: /tree|balance/, pose: findPose("Tree Pose") },
    { match: /triangle/, pose: findPose("Triangle Pose") },
    { match: /quiet rest|check.in|breathing|breath|gratitude|seated|standing|mountain|tadasana|easy|kind|comfortable|focus/, pose: findPose("Easy Pose") },
  ];
  const matchedPose = guided.find((item) => item.match.test(value))?.pose;
  const pose = matchedPose ?? findPose("Easy Pose");
  let cues = pose.steps.slice(0, 3);
  if (/seated side stretch/.test(value)) {
    cues = ["Sit tall on a chair or cushion. Keep both sitting bones grounded.", "Place one hand beside you. Reach the other arm up, then gently lean toward the grounded hand.", "Take two comfortable breaths. Sit tall and repeat on the other side."];
  } else if (/shoulder rolls|neck release|neck and shoulder|neck mobility/.test(value)) {
    cues = ["Sit or stand tall. Let your shoulders feel heavy.", "Slowly lift your shoulders toward your ears, roll them back, then let them drop. Repeat three times.", "Turn your head a little to one side, return to centre, then the other. Keep the movement small and pain-free."];
  } else if (/body scan/.test(value)) {
    cues = ["Lie down or sit with support. Let your eyes close or soften.", "Notice your feet, legs, belly, shoulders, and face one area at a time.", "Nothing needs to change. If you feel uncomfortable, open your eyes and return to the room."];
  } else if (/deep breathing|belly breathing|breathing|breath awareness/.test(value)) {
    cues = ["Sit comfortably. Place a hand on your belly if that feels okay.", "Breathe in naturally and notice your hand rise a little. Let the breath out without forcing it.", "Repeat for three easy breaths. Stop if you feel dizzy."];
  } else if (/cat.?cow/.test(value)) {
    cues = ["Sit near the front of a chair with feet on the floor and hands resting on your thighs.", "Breathe in and gently lift your chest. Breathe out and softly round your back.", "Repeat slowly two or three times. Keep the movement comfortable."];
  } else if (/gratitude/.test(value)) {
    cues = ["Sit or lie in a comfortable position.", "Think of one small thing that felt okay today. No need to force a positive feeling.", "Take one easy breath and notice how you feel."];
  } else if (/warm.up|joint warm|mobility|ankle|comfortable short walk|standing balance/.test(value)) {
    cues = ["Sit tall or stand near a chair for support.", "Slowly circle your shoulders and wrists. Move your ankles gently too.", "Keep each movement small and comfortable. Stop if anything hurts."];
  } else if (/screen|eye|look away/.test(value)) {
    cues = ["Sit comfortably and look away from your screen.", "Let your eyes rest on something far away for a few easy breaths. Do not press your eyes.", "Blink gently and relax your shoulders."];
  } else if (/chair chest/.test(value)) {
    cues = ["Sit toward the front of a chair, feet flat on the floor.", "Hold the sides of the chair or place hands behind your hips. Gently lift your chest without arching your lower back.", "Take two comfortable breaths, then relax."];
  }
  return { title: matchedPose ? pose.name : label, pose, cues };
};
const getSaved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};
const saveLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
  return true;
};

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [dark, setDark] = useState(() => getSaved("ywm-dark", false));
  const [profile, setProfile] = useState(() => getSaved("ywm-profile", { nickname: "", kidMode: false }));
  const [progress, setProgress] = useState(() => getSaved("ywm-progress", { minutes: 0, sessions: 0, lastDay: "", streak: 0 }));
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi, friend! I'm Yogi Buddy 🌿\n\nWhat would you like to do today?", initial: true }]);
  const [chatInput, setChatInput] = useState("");
  const [chatError, setChatError] = useState("");
  const [chatService, setChatService] = useState({ state: "checking", label: "Checking AI service" });
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [session, setSession] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const chatEnd = useRef(null);
  const creditedMinutes = useRef(0);

  useEffect(() => { saveLocal("ywm-dark", dark); }, [dark]);
  useEffect(() => { saveLocal("ywm-profile", profile); }, [profile]);
  useEffect(() => { saveLocal("ywm-progress", progress); }, [progress]);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then(async (response) => {
        const status = await response.json();
        if (cancelled) return;
        const provider = status.provider || "ollama";
        setChatService(response.ok
          ? { state: "ready", provider, label: provider === "huggingface" ? `Hosted open model · ${status.model}` : `Local AI ready · ${status.model}` }
          : { state: "unavailable", provider, label: status.hint || status.error || "AI service unavailable" });
      })
      .catch(() => {
        if (!cancelled) setChatService({ state: "unavailable", label: "AI service status unavailable" });
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!session?.timerRunning || remaining <= 0) return undefined;
    const timer = window.setInterval(() => setRemaining((time) => Math.max(0, time - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [session?.timerRunning, remaining]);
  useEffect(() => {
    if (!session?.timerRunning) return;
    const elapsedSeconds = session.totalSeconds - remaining;
    const minutesPractised = Math.min(session.minutes, Math.max(1, Math.ceil(elapsedSeconds / 60)));
    const additionalMinutes = minutesPractised - creditedMinutes.current;
    if (additionalMinutes <= 0) return;
    creditedMinutes.current = minutesPractised;
    setProgress((current) => ({ ...current, minutes: current.minutes + additionalMinutes }));
  }, [remaining, session]);
  useEffect(() => {
    if (session?.timerRunning && remaining === 0 && !finished) completeSession();
    // completeSession is intentionally triggered only after an active timer reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, session, finished]);
  const goChat = (text) => {
    setActiveTab("chat");
    if (text) {
      setMessages((current) => [...current, { role: "user", content: text }]);
      setTimeout(() => sendToAgent(text), 0);
    }
  };
  const sendToAgent = async (text) => {
    setBusy(true);
    setChatError("");
    setChatInput("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.filter((message) => !message.initial), { role: "user", content: text }],
          nickname: profile.nickname,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Assistant service unavailable (${response.status}).`);
      }
      const data = await response.json();
      if (!data.reply) throw new Error("The assistant returned an empty reply.");
      const provider = data.provider || chatService.provider || "ollama";
      setChatService({ state: "ready", provider, label: provider === "huggingface" ? "Hosted open model ready" : "Local AI ready" });
      const poseGuide = /\b(how do i|how to|show me|teach me|steps for|demonstrate)\b/i.test(text)
        ? findMentionedPoses(`${text}\n${data.reply}`)
        : [];
      setMessages((current) => [...current, { role: "assistant", content: data.reply, poseGuide }]);
    } catch (error) {
      setChatService({ state: "unavailable", provider: chatService.provider, label: "AI service unavailable" });
      setChatError(`${error.message} Showing a conservative built-in reply instead.`);
      const poseGuide = /\b(how do i|how to|show me|teach me|steps for|demonstrate)\b/i.test(text)
        ? findMentionedPoses(text)
        : [];
      setMessages((current) => [...current, { role: "assistant", content: safeQuickReply(text), local: true, poseGuide }]);
    } finally {
      setBusy(false);
    }
  };
  const submitChat = (event) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (text && !busy) {
      setMessages((current) => [...current, { role: "user", content: text }]);
      void sendToAgent(text);
    }
  };
  const startSession = (goal = "Stress and anxiety relief", minutes = 5) => {
    const routine = getRoutine(goal);
    const steps = [...routine.sequence];
    const totalSeconds = minutes * 60;
    setSession({ ...routine, minutes, steps, totalSeconds, prepared: false, timerRunning: false });
    setRemaining(totalSeconds);
    creditedMinutes.current = 0;
    setFinished(false);
  };
  const startSessionTimer = () => {
    if (!session || session.timerRunning || finished) return;
    if (creditedMinutes.current === 0) {
      creditedMinutes.current = 1;
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      setProgress((current) => ({
        ...current,
        minutes: current.minutes + 1,
        sessions: current.sessions + 1,
        lastDay: today,
        streak: current.lastDay === today ? current.streak : current.lastDay === yesterday ? current.streak + 1 : 1,
      }));
    }
    setSession((current) => ({ ...current, timerRunning: true }));
  };
  const pauseSessionTimer = () => {
    if (session?.timerRunning) setSession((current) => ({ ...current, timerRunning: false }));
  };
  const completeSession = () => {
    if (!session || finished) return;
    setFinished(true);
    setSession((current) => ({ ...current, timerRunning: false }));
  };
  const closeSession = () => {
    setSession(null);
    setFinished(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };
  const filteredPoses = poseData.poses.filter((pose) =>
    (filter === "All" || pose.category === filter) &&
    `${pose.name} ${pose.sanskrit} ${pose.bodyPart} ${pose.level}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className={dark ? "app-shell dark" : "app-shell"}>
      <header className="topbar">
        <button className="brand" onClick={() => setActiveTab("home")} aria-label="Yogi Buddy home — Yoga with Me">
          <span className="brand-mark"><Flower2 size={21} /></span>
          <span className="brand-copy"><strong>Yogi Buddy</strong><small>Yoga with Me</small></span>
        </button>
        <div className="topbar-right">
          <span className="local-pill"><ShieldCheck size={14} /> No account needed</span>
          <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Settings"><Settings size={19} /></button>
          <button className="avatar" onClick={() => setSettingsOpen(true)} aria-label="Set your nickname">{profile.nickname ? profile.nickname.slice(0, 1).toUpperCase() : "♡"}</button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === "home" && <HomeView profile={profile} mood={mood} setMood={setMood} startSession={startSession} goChat={goChat} setActiveTab={setActiveTab} progress={progress} />}
        {activeTab === "chat" && <ChatView messages={messages} busy={busy} error={chatError} service={chatService} input={chatInput} setInput={setChatInput} submit={submitChat} sendQuick={goChat} chatEnd={chatEnd} />}
        {activeTab === "explore" && <ExploreView search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} poses={filteredPoses} startSession={startSession} />}
        {activeTab === "progress" && <ProgressView progress={progress} setActiveTab={setActiveTab} />}
      </main>

      <footer className="site-footer">
        <p>Made with care by <strong>Nooras Fatima</strong></p>
        <div className="footer-links">
          <a href="https://github.com/nooras" target="_blank" rel="noreferrer">GitHub profile</a>
          <a href="https://github.com/nooras/yogibuddy" target="_blank" rel="noreferrer">Source code</a>
        </div>
        <p className="footer-build-credit">Built with GitHub Copilot and an open Ollama model</p>
      </footer>

      <nav className="bottom-nav" aria-label="Main navigation">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            <Icon size={20} strokeWidth={activeTab === id ? 2.3 : 1.8} /><span>{label}</span>
          </button>
        ))}
      </nav>

      {session && <SessionModal session={session} remaining={remaining} finished={finished} close={closeSession} onPrepared={() => setSession((current) => ({ ...current, prepared: true }))} onStartTimer={startSessionTimer} onPauseTimer={pauseSessionTimer} />}
      {settingsOpen && <SettingsModal profile={profile} setProfile={setProfile} dark={dark} setDark={setDark} close={() => setSettingsOpen(false)} />}
    </div>
  );
}

function HomeView({ profile, mood, setMood, startSession, goChat, setActiveTab, progress }) {
  const firstName = profile.nickname ? `, ${profile.nickname}` : "";
  return (
    <div className="home-page page-width">
      <section className="welcome-row">
        <div>
          <p className="eyebrow"><span className="live-dot" /> YOUR LITTLE PAUSE</p>
          <h1>A little more <em>you</em><br />in your day{firstName}.</h1>
          <p className="welcome-copy">No perfect poses required. Just show up as you are.</p>
        </div>
        <div className="hero-illustration" aria-label="Illustration of a person sitting peacefully">
          <div className="sun-disc" />
          <span className="hero-leaf leaf-one">✳</span><span className="hero-leaf leaf-two">✳</span>
          <div className="yoga-person"><span className="person-head" /><span className="person-body" /><span className="person-arm arm-left" /><span className="person-arm arm-right" /><span className="person-leg leg-left" /><span className="person-leg leg-right" /></div>
          <span className="hero-caption">breathe in, breathe out</span>
        </div>
      </section>

      <section className="mood-card">
        <div className="mood-heading"><div><span className="section-kicker">A GENTLE CHECK-IN</span><h2>How do you feel today?</h2></div><span className="mood-sparkle">✦</span></div>
        <div className="mood-options" role="group" aria-label="Choose how you feel">
          {[["😌", "Calm"], ["😮‍💨", "A little tense"], ["⚡", "Full of energy"], ["🌧️", "Low-key today"]].map(([emoji, label]) => (
            <button key={label} className={`mood-option ${mood === label ? "selected" : ""}`} onClick={() => setMood(label)} aria-pressed={mood === label}>
              <span>{emoji}</span><small>{label}</small>
            </button>
          ))}
        </div>
        <p className="mood-response">{mood ? "Thanks for checking in. We can meet you right where you are." : "No wrong answers—this is just for you."}</p>
      </section>

      <section className="daily-row">
        <div><span className="section-kicker">TODAY'S LITTLE PLAN</span><h2>A softer start</h2><p>5 minutes · gentle stretch · all levels</p></div>
        <button className="button-primary" onClick={() => startSession("Flexibility and mobility", 5)}><Play size={16} fill="currentColor" /> Start yoga</button>
      </section>

      <section className="quick-section">
        <div className="section-title-row"><div><span className="section-kicker">PICK YOUR MOMENT</span><h2>What sounds good?</h2></div><button className="text-link" onClick={() => setActiveTab("explore")}>Explore all <ArrowRight size={15} /></button></div>
        <div className="quick-grid">
          {QUICK_STARTS.map(({ label, icon, goal }, index) => <button key={label} className={`quick-card quick-${index}`} onClick={() => startSession(goal, 5)}>
            <span className="quick-emoji">{icon}</span><span>{label}</span><ArrowRight size={16} className="quick-arrow" />
          </button>)}
        </div>
      </section>

      <section className="buddy-banner">
        <div className="buddy-icon"><Sparkles size={21} /></div>
        <div><strong>Need a little help choosing?</strong><p>Yogi Buddy is here to listen, not lecture.</p></div>
        <button aria-label="Chat with Yogi Buddy" onClick={() => goChat()}><ArrowRight size={18} /></button>
      </section>

      <section className="home-footer">
        <div><span className="footer-streak">✿</span><div><strong>{progress.streak} day streak</strong><small>Every little bit counts</small></div></div>
        <div><span className="footer-streak">◷</span><div><strong>{progress.minutes} min practised</strong><small>One breath at a time</small></div></div>
      </section>
    </div>
  );
}

function ChatView({ messages, busy, error, service, input, setInput, submit, sendQuick, chatEnd }) {
  const initial = messages.length === 1 && messages[0].initial;
  const privacyNotice = service.provider === "huggingface"
    ? "Chat messages are sent to the hosted Hugging Face model. Avoid sharing identifying or sensitive health information."
    : service.provider === "ollama"
      ? "Chat runs through the configured Ollama service. Avoid sharing identifying or sensitive health information."
      : "Chat is sent to the configured AI service. Avoid sharing identifying or sensitive health information.";
  return <section className="chat-page page-width">
    <div className="chat-heading"><span className="buddy-orb"><Sparkles size={20} /></span><div><h1>Chat with Yogi Buddy</h1><p>Your kind, no-pressure yoga companion</p></div><span className={`online-status service-${service.state}`} title={service.label}><i /> {service.label}</span></div>
    <div className="chat-privacy"><ShieldCheck size={15} /> {privacyNotice}</div>
    <div className="chat-log" aria-live="polite">
      {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`message-row ${message.role}`}>
        {message.role === "assistant" && <span className="message-avatar">✿</span>}
        <div className={`message-bubble ${message.local ? "local-reply" : ""}`}>
          {message.poseGuide?.length
            ? <p>Here's a clear visual guide to {message.poseGuide[0].name}. Move gently, and use the supported option if you'd like.</p>
            : message.content.split("\n").map((line, lineIndex) => <p key={lineIndex}>{line}</p>)}
          {message.local && <small>Local safety-first response</small>}
          {(message.poseGuide?.length ? message.poseGuide : message.role === "assistant" ? findMentionedPoses(message.content) : []).map((pose) => <PoseHowTo key={pose.sanskrit} pose={pose} compact />)}
        </div>
      </div>)}
      {initial && <div className="chat-quick-picks">{QUICK_STARTS.map((item) => <button key={item.label} onClick={() => sendQuick(item.label)}><span>{item.icon}</span>{item.label}</button>)}</div>}
      {busy && <div className="message-row assistant"><span className="message-avatar">✿</span><div className="message-bubble typing"><i /><i /><i /></div></div>}
      <div ref={chatEnd} />
    </div>
    {error && <div role="status" className="chat-error"><CircleHelp size={15} />{error}</div>}
    <form className="chat-composer" onSubmit={submit}>
      <input aria-label="Message Yogi Buddy" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell me what's on your mind…" />
      <button type="submit" disabled={!input.trim() || busy} aria-label="Send message"><Send size={19} /></button>
    </form>
    <p className="disclaimer-small"><ShieldCheck size={13} /> Not a doctor. For serious or ongoing symptoms, please talk to a healthcare professional.</p>
  </section>;
}

function ExploreView({ search, setSearch, filter, setFilter, poses, startSession }) {
  const [openPose, setOpenPose] = useState(null);
  const [routineDuration, setRoutineDuration] = useState(10);
  const categories = ["All", ...new Set(poseData.poses.map((pose) => pose.category))];
  return <section className="explore-page page-width">
    <div className="page-heading"><div><span className="section-kicker">WANDER A LITTLE</span><h1>Explore your practice</h1><p>Take what feels good. Leave the rest.</p></div><span className="explore-flower">✿</span></div>
    <div className="explore-feature"><div><span>YOUR BODY, YOUR PACE</span><h2>A library full of<br />little possibilities.</h2><p>Gentle guidance, helpful options, always.</p></div><div className="feature-illustration">🪷</div></div>
    <div className="routine-section"><div className="section-title-row"><div><span className="section-kicker">READY-MADE PLANS</span><h2>Find your flow</h2></div></div><div className="routine-scroll">
      {routineData.programs.map((routine, index) => <article key={routine.goal} className="routine-card"><span className={`routine-dot routine-dot-${index % 5}`}>{["☁️", "🌱", "🌙", "💤", "🪑"][index % 5]}</span><strong>{routine.goal}</strong><small>{routineDuration} min · adaptable</small><div className="routine-durations">{routineData.durationMinutes.map((minutes) => <button key={minutes} className={routineDuration === minutes ? "selected" : ""} onClick={() => setRoutineDuration(minutes)}>{minutes}</button>)}</div><button className="routine-start" onClick={() => startSession(routine.goal, routineDuration)} aria-label={`Start ${routine.goal} for ${routineDuration} minutes`}><Play size={14} fill="currentColor" /></button></article>)}
    </div></div>
    <div className="library-head"><div><span className="section-kicker">A FRIENDLY FIELD GUIDE</span><h2>Pose library <small>{poseData.poses.length} poses</small></h2></div></div>
    <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search poses, Sanskrit, body area…" /><kbd>/</kbd></label>
    <div className="filter-row">{categories.map((category) => <button key={category} className={`filter-chip ${filter === category ? "on" : ""}`} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="pose-grid">{poses.map((pose, index) => <article key={pose.sanskrit} className="pose-card">
      <div className={`pose-art pose-art-${index % 6}`}><PoseIllustration name={pose.name} category={pose.category} compact /><small>{pose.level}</small></div>
      <div className="pose-info"><span className="section-kicker">{pose.category}</span><h3>{pose.name}</h3><p className="sanskrit">{pose.sanskrit}</p><div className="pose-meta"><span><Clock3 size={13} />{pose.duration}</span><span>{pose.bodyPart}</span></div>
        <button className="pose-details-link" onClick={() => setOpenPose(openPose === pose.sanskrit ? null : pose.sanskrit)}>{openPose === pose.sanskrit ? "Close details" : "Steps & safety"} <ChevronDown size={14} /></button>
        {openPose === pose.sanskrit && <PoseHowTo pose={pose} />}
      </div>
    </article>)}</div>
    {!poses.length && <div className="empty-state"><Flower2 size={24} /><p>No poses found. Try a different search.</p></div>}
    <details className="knowledge-library"><summary><BookOpen size={18} /><span><strong>More ways to practice</strong><small>{poseData.styles.length} styles · breathing · meditation · mudras · gentle quick tricks</small></span><ChevronDown size={16} /></summary>
      <div className="knowledge-groups">
        <KnowledgeGroup title="Yoga styles" entries={poseData.styles} />
        <div className="knowledge-group"><h3>Breathing practices</h3>{poseData.breathing.map((item) => <article key={item.name}><strong>{item.name}</strong><p>{item.safety}</p></article>)}</div>
        <KnowledgeGroup title="Meditation & relaxation" entries={poseData.meditation} />
        <KnowledgeGroup title="Mudras (hand gestures)" entries={poseData.mudras} />
        <KnowledgeGroup title="Quick tricks" entries={poseData.quickTricks} />
        <div className="knowledge-group"><h3>Beginner-safe cleansing information</h3>{poseData.cleansing.map((item) => <article key={item.name}><strong>{item.name}</strong><p>{item.safety}</p></article>)}</div>
      </div>
    </details>
  </section>;
}

function PoseHowTo({ pose, compact = false }) {
  return <div className={`pose-howto ${compact ? "chat-pose-howto" : ""}`}>
    {compact && <div className="chat-pose-title"><strong>{pose.name}</strong><span>{pose.sanskrit}</span></div>}
    <PoseIllustration name={pose.name} category={pose.category} />
    <b>Try it gently</b>
    <ol>{pose.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    {!compact && <><b>Why people enjoy it</b><p>{pose.benefits}</p><b>Make it your own</b><p>{pose.modifications}</p><b>Take care</b><p>{pose.contraindications}</p></>}
  </div>;
}

function KnowledgeGroup({ title, entries }) {
  return <div className="knowledge-group"><h3>{title}</h3><div className="knowledge-tags">{entries.map((entry) => <span key={entry}>{entry}</span>)}</div></div>;
}

function ProgressView({ progress, setActiveTab }) {
  const goals = [{ label: "Minutes in your day", value: progress.minutes, icon: "◷" }, { label: "Times you showed up", value: progress.sessions, icon: "✿" }, { label: "Days in a row", value: progress.streak, icon: "☀" }];
  return <section className="progress-page page-width">
    <div className="page-heading"><div><span className="section-kicker">JUST FOR YOU</span><h1>Your gentle progress</h1><p>Little moments add up. No streak to break, ever.</p></div><span className="progress-flower">✦</span></div>
    <div className="progress-banner"><div><span className="section-kicker">YOUR PRACTICE, YOUR PACE</span><h2>You made time<br />for yourself.</h2><p>That counts. Every single time.</p></div><div className="progress-art">🌱</div></div>
    <div className="stats-grid">{goals.map((goal) => <div className="stat-card" key={goal.label}><span className="stat-icon">{goal.icon}</span><strong>{goal.value}</strong><span>{goal.label}</span></div>)}</div>
    <div className="progress-note"><ShieldCheck size={18} /><div><strong>Just on this device</strong><p>Your practice notes and progress live in your browser. No account, no cloud profile. Clear them anytime in Settings.</p></div></div>
    <div className="empty-badge"><div>✿</div><span className="section-kicker">YOUR BADGE GARDEN</span><h2>Room to grow.</h2><p>Your first badge is waiting after your first session. No rush—it's not going anywhere.</p><button className="text-link" onClick={() => setActiveTab("home")}>Find a little flow <ArrowRight size={15} /></button></div>
  </section>;
}

function SessionModal({ session, remaining, finished, close, onPrepared, onStartTimer, onPauseTimer }) {
  const [hasConcern, setHasConcern] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const cueSchedule = useMemo(() => session.steps.flatMap((label, phaseIndex) => {
    const guidance = getGuidance(label);
    return guidance.cues.map((cue, cueIndex) => ({ guidance, cue, phaseIndex, cueIndex }));
  }), [session.steps]);
  const elapsed = session.totalSeconds - remaining;
  const cueIndex = Math.min(cueSchedule.length - 1, Math.floor((elapsed / session.totalSeconds) * cueSchedule.length));
  const activeStep = cueSchedule[cueIndex];
  const { guidance, cue: activeCue, phaseIndex, cueIndex: poseCueIndex } = activeStep;
  useEffect(() => {
    if (!voiceEnabled || !session.timerRunning || finished || !activeCue || !("speechSynthesis" in window)) return undefined;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${guidance.title}. ${activeCue}`);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [voiceEnabled, session.timerRunning, finished, phaseIndex, cueIndex, activeCue, guidance.title]);
  const progress = finished ? 100 : Math.min(100, (elapsed / session.totalSeconds) * 100);
  const clock = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return <div className="modal-backdrop session-backdrop" role="dialog" aria-modal="true" aria-label="Guided yoga session">
    <div className="session-modal"><div className="session-top"><button className="icon-button" onClick={close} aria-label="Close session"><X size={20} /></button><span><span className="live-dot" /> YOUR LITTLE SESSION</span>{session.prepared && !finished && <button className="icon-button" onClick={() => setVoiceEnabled((enabled) => !enabled)} aria-label={voiceEnabled ? "Turn voice guidance off" : "Turn voice guidance on"} aria-pressed={voiceEnabled}>{voiceEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}</button>}</div>
      {finished ? <div className="session-finish"><div className="finish-flower">✿</div><span className="section-kicker">THAT WAS LOVELY</span><h1>You showed up<br />for yourself.</h1><p>{session.minutes} minutes, just for you. Let that be enough.</p><button className="button-primary" onClick={close}><Check size={17} /> All done</button></div> : !session.prepared ? <div className="session-safety-check"><span className="section-kicker">A QUICK, OPTIONAL CHECK-IN</span><h1>Let's make it<br />feel right for you.</h1><p>Any pregnancy, recent injury or surgery, high or low blood pressure, or back, knee, or neck concerns today?</p><div className="safety-options"><button className={hasConcern === false ? "selected" : ""} onClick={() => setHasConcern(false)}>No concerns today</button><button className={hasConcern === true ? "selected" : ""} onClick={() => setHasConcern(true)}>I'll modify or skip</button></div>{hasConcern && <p className="safety-guidance">Choose the chair or resting option, keep movements gentle, and skip anything that doesn't feel right. Please check with a clinician before practising if you have a medical condition, serious or persistent pain, or you're unsure what's safe.</p>}{hasConcern === false && <p className="safety-guidance">Lovely. Still, stop if you feel sharp pain, dizzy, or unwell. No pose is worth pushing through.</p>}<button className="button-primary wide" disabled={hasConcern === null} onClick={onPrepared}>{hasConcern === true ? "Continue with gentle options" : "Let's begin"} <ArrowRight size={16} /></button><button className="safety-skip" onClick={onPrepared}>Skip check-in & begin</button></div> : <>
        <div className="session-content"><span className="section-kicker">{session.goal.toUpperCase()}</span><h1>{guidance.title}</h1><p className="session-phase-label">{session.steps[phaseIndex]}</p><p>{session.safety} Find a comfortable version. A chair, a smaller stretch, or a pause all count.</p><div className="session-pose-wrap"><PoseIllustration key={`${phaseIndex}-${poseCueIndex}`} name={guidance.title} category={guidance.pose.category} /><span className={`pose-motion pose-motion-${poseCueIndex}`} aria-hidden="true">{["↑", "↗", "↔"][poseCueIndex % 3]}</span></div><div className="session-guidance" aria-live="polite"><h2>Steps</h2><ol>{guidance.cues.map((cue, index) => <li key={cue} className="active"><span>{index + 1}</span>{cue}</li>)}</ol></div><div className="session-clock">{clock}</div><div className="session-progress"><span style={{ width: `${progress}%` }} /></div><div className="session-step-count"><span>{session.timerRunning ? "Timer is running" : elapsed > 0 ? "Timer paused" : "Ready when you are"}</span><span>{phaseIndex + 1} of {session.steps.length} poses</span></div></div>
        <div className="session-actions"><div className="session-timer-controls"><button className="button-primary" onClick={onStartTimer} disabled={session.timerRunning}>{session.timerRunning ? <Check size={17} /> : <Play size={17} fill="currentColor" />}{session.timerRunning ? "Timer running" : elapsed > 0 ? "Resume timer" : "Start timer"}</button><button className="button-secondary" onClick={onPauseTimer} disabled={!session.timerRunning}><Pause size={17} fill="currentColor" />Pause timer</button></div></div>
        <p className="session-safety"><ShieldCheck size={14} /> Stop if you feel sharp pain or dizzy. Your body gets the final say.</p>
      </>}
    </div>
  </div>;
}

function SettingsModal({ profile, setProfile, dark, setDark, close }) {
  const clearProgress = () => {
    if (window.confirm("Clear this device's practice progress? This can't be undone.")) {
      localStorage.removeItem("ywm-progress");
      window.location.reload();
    }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}>
    <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="settings-heading"><div><span className="section-kicker">MAKE YOURSELF AT HOME</span><h2 id="settings-title">Your settings</h2></div><button className="icon-button" onClick={close} aria-label="Close settings"><X size={19} /></button></div>
      <label className="field-label">Your nickname <small>optional</small><input value={profile.nickname} maxLength={24} onChange={(event) => setProfile({ ...profile, nickname: event.target.value })} placeholder="What should Yogi Buddy call you?" /></label>
      <div className="setting-row"><div><strong>Kid-friendly mode</strong><p>Keep session suggestions extra gentle</p></div><button className={`toggle ${profile.kidMode ? "on" : ""}`} onClick={() => setProfile({ ...profile, kidMode: !profile.kidMode })} aria-pressed={profile.kidMode}><i /></button></div>
      <div className="setting-row"><div><strong>Dark mode</strong><p>A softer screen for evening practice</p></div><button className={`toggle ${dark ? "on" : ""}`} onClick={() => setDark(!dark)} aria-pressed={dark}><i /></button></div>
      <div className="settings-divider" /><button className="clear-data" onClick={clearProgress}><ShieldCheck size={16} /> Clear my on-device progress</button><p className="settings-footnote">No sign-up. Your nickname and progress stay in this browser only.</p>
      <button className="button-primary wide" onClick={close}>Save & close</button>
    </section>
  </div>;
}

export default App;
