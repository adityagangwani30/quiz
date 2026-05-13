import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveTeamSession, getTeamSession, saveLeaderboardEntry } from '../firebase/config';
import { calculateScore, getSubmissionStatus } from '../data/scoring';

const GameContext = createContext();

const TOTAL_TIME = 300; // 5 minutes in seconds

const generateApplicationId = () => {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `KIADB/${year}/IND/${num}`;
};

const initialState = {
  // Session
  sessionId: null,
  applicationId: null,
  teamName: '',
  teamNumber: '',

  // Game state
  phase: 'landing', // landing, registration, level1, level2, result
  selectedDocuments: [],
  formData: {},
  activeSection: 'applicant',

  // Timer
  timeRemaining: TOTAL_TIME,
  timerRunning: false,
  timerStarted: false,

  // Results
  score: null,
  submitted: false,

  // UI
  documentViewerOpen: false,
  activeDocument: null,
  showDocPanel: false,
  warningShown120: false,
  warningShown60: false,
  warningShown20: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_TEAM_INFO':
      return {
        ...state,
        teamName: action.payload.teamName,
        teamNumber: action.payload.teamNumber,
        sessionId: uuidv4(),
        applicationId: generateApplicationId(),
      };

    case 'START_LEVEL1':
      return { ...state, phase: 'level1' };

    case 'SELECT_DOCUMENT': {
      const docs = [...state.selectedDocuments];
      const idx = docs.indexOf(action.payload);
      if (idx >= 0) {
        docs.splice(idx, 1);
      } else if (docs.length < 3) {
        docs.push(action.payload);
      }
      return { ...state, selectedDocuments: docs };
    }

    case 'CONFIRM_DOCUMENTS':
      return { ...state, phase: 'level2', timerRunning: true, timerStarted: true };

    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };

    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.fieldId]: action.payload.value }
      };

    case 'TICK_TIMER':
      return { ...state, timeRemaining: Math.max(0, state.timeRemaining - 1) };

    case 'OPEN_DOCUMENT_VIEWER':
      return { ...state, documentViewerOpen: true, activeDocument: action.payload };

    case 'CLOSE_DOCUMENT_VIEWER':
      return { ...state, documentViewerOpen: false, activeDocument: null };

    case 'TOGGLE_DOC_PANEL':
      return { ...state, showDocPanel: !state.showDocPanel };

    case 'SET_WARNING_SHOWN':
      if (action.payload === 120) return { ...state, warningShown120: true };
      if (action.payload === 60) return { ...state, warningShown60: true };
      if (action.payload === 20) return { ...state, warningShown20: true };
      return state;

    case 'SUBMIT': {
      const score = calculateScore(state.formData, state.timeRemaining, TOTAL_TIME);
      return {
        ...state,
        phase: 'result',
        timerRunning: false,
        submitted: true,
        score,
      };
    }

    case 'RESTORE_SESSION':
      return { ...state, ...action.payload };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Timer effect
  useEffect(() => {
    if (!state.timerRunning || state.timeRemaining <= 0) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK_TIMER' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timerRunning, state.timeRemaining]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (state.timeRemaining === 0 && state.timerStarted && !state.submitted) {
      dispatch({ type: 'SUBMIT' });
    }
  }, [state.timeRemaining, state.timerStarted, state.submitted]);

  // Save session on state changes
  useEffect(() => {
    if (state.sessionId && state.phase !== 'landing' && state.phase !== 'registration') {
      saveTeamSession(state.sessionId, {
        sessionId: state.sessionId,
        applicationId: state.applicationId,
        teamName: state.teamName,
        teamNumber: state.teamNumber,
        phase: state.phase,
        selectedDocuments: state.selectedDocuments,
        formData: state.formData,
        timeRemaining: state.timeRemaining,
        submitted: state.submitted,
        score: state.score,
      });
    }
  }, [state.sessionId, state.phase, state.formData, state.submitted, state.score]);

  // Save leaderboard entry on submission
  useEffect(() => {
    if (state.submitted && state.score) {
      saveLeaderboardEntry({
        sessionId: state.sessionId,
        teamName: state.teamName,
        teamNumber: state.teamNumber,
        finalScore: state.score.finalScore,
        accuracy: state.score.accuracy,
        completion: state.score.completion,
        speedBonus: state.score.speedBonus,
        timeRemaining: state.timeRemaining,
        submittedAt: Date.now(),
      });
    }
  }, [state.submitted]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export { TOTAL_TIME };
