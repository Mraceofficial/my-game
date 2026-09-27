import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, UserProgress } from './types';
import { loadProgress, saveProgress, resetAllProgress } from './services/storage';
import { sound } from './services/sound';
import { BackgroundClouds } from './components/BackgroundClouds';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { AlphabetGame } from './components/AlphabetGame';
import { NumbersGame } from './components/NumbersGame';
import { NumberWordsGame } from './components/NumberWordsGame';
import { WordsGame } from './components/WordsGame';
import { SentencesGame } from './components/SentencesGame';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { GameOverModal } from './components/GameOverModal';
import { CustomContentManager } from './components/CustomContentManager';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCustomManagerOpen, setIsCustomManagerOpen] = useState(false);

  // Session complete modal state
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionModalData, setSessionModalData] = useState<{
    stars: number;
    points: number;
    isLevelComplete: boolean;
  }>({ stars: 0, points: 0, isLevelComplete: false });

  // Custom play request state
  const [initialCustomMode, setInitialCustomMode] = useState<boolean>(false);
  const [selectedCustomWordId, setSelectedCustomWordId] = useState<string | undefined>(undefined);
  const [selectedCustomSentenceId, setSelectedCustomSentenceId] = useState<string | undefined>(undefined);

  // Sync sound settings to sound service on mount
  useEffect(() => {
    sound.setSoundEnabled(progress.soundEnabled);
    sound.setMusicEnabled(progress.musicEnabled);
    sound.setSpeechEnabled(progress.speechEnabled);
  }, []);

  // Save progress whenever it updates
  const handleUpdateProgress = useCallback((updated: Partial<UserProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updated };
      saveProgress(next);
      return next;
    });
  }, []);

  // Sound toggle from header
  const handleToggleSound = () => {
    const next = !progress.soundEnabled;
    sound.setSoundEnabled(next);
    handleUpdateProgress({ soundEnabled: next });
    if (next) sound.playButton();
  };

  // Reset progress from settings
  const handleResetProgress = () => {
    const reset = resetAllProgress();
    setProgress(reset);
    sound.setSoundEnabled(reset.soundEnabled);
    sound.setMusicEnabled(reset.musicEnabled);
    sound.setSpeechEnabled(reset.speechEnabled);
  };

  // Session completed in any game mode
  const handleCompleteSession = (starsEarned: number, pointsEarned: number, isLevelComplete: boolean) => {
    setSessionModalData({
      stars: starsEarned,
      points: pointsEarned,
      isLevelComplete,
    });
    setSessionModalOpen(true);
  };

  // Title badge based on mode
  const getTitleBadge = () => {
    switch (currentMode) {
      case 'alphabet':
        return `Type Alphabet - Level ${progress.alphabetLevel}`;
      case 'numbers':
        return `Type Numbers (1-100) - Level ${progress.numbersLevel || 1}`;
      case 'number_words':
        return `Number Words (1-100) - Level ${progress.numberWordsLevel || 1}`;
      case 'words':
        return `Type Words - Level ${progress.wordsLevel}`;
      case 'sentences':
        return `Type Sentences - Level ${progress.sentencesLevel}`;
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 flex flex-col relative selection:bg-amber-300 selection:text-amber-950 font-sans">
      {/* Playful Animated Sky & Clouds Background */}
      <BackgroundClouds />

      {/* Main Header */}
      <Header
        currentMode={currentMode}
        stars={progress.stars}
        score={progress.score}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenCustomManager={() => setIsCustomManagerOpen(true)}
        onGoHome={() => setCurrentMode('home')}
        titleBadge={getTitleBadge()}
      />

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col relative z-10">
        {currentMode === 'home' && (
          <HomeScreen
            onSelectMode={(mode) => setCurrentMode(mode)}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenCustomManager={() => setIsCustomManagerOpen(true)}
          />
        )}

        {currentMode === 'alphabet' && (
          <AlphabetGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onCompleteSession={handleCompleteSession}
            onGoHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'numbers' && (
          <NumbersGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onCompleteSession={handleCompleteSession}
            onGoHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'number_words' && (
          <NumberWordsGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onCompleteSession={handleCompleteSession}
            onGoHome={() => setCurrentMode('home')}
          />
        )}

        {currentMode === 'words' && (
          <WordsGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onCompleteSession={handleCompleteSession}
            onGoHome={() => {
              setInitialCustomMode(false);
              setSelectedCustomWordId(undefined);
              setCurrentMode('home');
            }}
            initialCustomMode={initialCustomMode}
            initialSelectedWordId={selectedCustomWordId}
          />
        )}

        {currentMode === 'sentences' && (
          <SentencesGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onCompleteSession={handleCompleteSession}
            onGoHome={() => {
              setInitialCustomMode(false);
              setSelectedCustomSentenceId(undefined);
              setCurrentMode('home');
            }}
            initialCustomMode={initialCustomMode}
            initialSelectedSentenceId={selectedCustomSentenceId}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        onResetProgress={handleResetProgress}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Custom Words & Sentences Manager Modal */}
      {isCustomManagerOpen && (
        <CustomContentManager
          onClose={() => setIsCustomManagerOpen(false)}
          onPlayCustomWords={(wordId) => {
            setSelectedCustomWordId(wordId);
            setInitialCustomMode(true);
            setIsCustomManagerOpen(false);
            setCurrentMode('words');
          }}
          onPlayCustomSentences={(sentenceId) => {
            setSelectedCustomSentenceId(sentenceId);
            setInitialCustomMode(true);
            setIsCustomManagerOpen(false);
            setCurrentMode('sentences');
          }}
        />
      )}

      {/* Session / Level Complete Celebration Modal */}
      <GameOverModal
        isOpen={sessionModalOpen}
        starsEarned={sessionModalData.stars}
        pointsEarned={sessionModalData.points}
        isLevelComplete={sessionModalData.isLevelComplete}
        animationsEnabled={progress.animationsEnabled}
        onPlayAgain={() => {
          setSessionModalOpen(false);
          // Restart current game mode by momentarily cycling or resetting
          const prevMode = currentMode;
          setCurrentMode('home');
          setTimeout(() => setCurrentMode(prevMode), 20);
        }}
        onChooseAnotherGame={() => {
          setSessionModalOpen(false);
          setCurrentMode('home');
        }}
        onGoHome={() => {
          setSessionModalOpen(false);
          setCurrentMode('home');
        }}
      />
    </div>
  );
}
