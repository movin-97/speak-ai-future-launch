
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const DAILY_FREE_MINUTES = 10;

interface UsageData {
  date: string;
  minutesUsed: number;
  visits: number;
}

export const useUsageTracking = () => {
  const { currentUser } = useAuth();
  const [sessionTime, setSessionTime] = useState(0);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load usage data on mount
    loadUsageData();
  }, [currentUser]);

  useEffect(() => {
    // Session timer
    const interval = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        updateUsage(newTime);
        
        if (newTime >= DAILY_FREE_MINUTES * 60) {
          setIsTimeUp(true);
          if (currentUser) {
            setShowUpgradeModal(true);
          }
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const loadUsageData = async () => {
    try {
      let usageDoc;
      
      if (currentUser) {
        // Logged in user
        const userRef = doc(db, 'users', currentUser.uid);
        usageDoc = await getDoc(userRef);
      } else {
        // Guest user - use localStorage
        const guestData = localStorage.getItem('guestUsage');
        if (guestData) {
          const parsed = JSON.parse(guestData);
          if (parsed.date === today) {
            setDailyUsage(parsed.minutesUsed);
            setSessionTime(parsed.minutesUsed * 60);
          }
        }
        return;
      }

      if (usageDoc?.exists()) {
        const data = usageDoc.data() as UsageData;
        if (data.date === today) {
          setDailyUsage(data.minutesUsed);
          setSessionTime(data.minutesUsed * 60);
        } else {
          // New day, reset usage
          await updateDoc(doc(db, 'users', currentUser.uid), {
            date: today,
            minutesUsed: 0,
            visits: data.visits + 1
          });
        }
      } else {
        // First time user
        await setDoc(doc(db, 'users', currentUser.uid), {
          date: today,
          minutesUsed: 0,
          visits: 1
        });
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  const updateUsage = async (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    
    if (currentUser) {
      // Update Firestore for logged in users
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          minutesUsed: minutes,
          date: today
        });
        setDailyUsage(minutes);
      } catch (error) {
        console.error('Error updating usage:', error);
      }
    } else {
      // Update localStorage for guests
      const guestData = {
        date: today,
        minutesUsed: minutes,
        visits: 1
      };
      localStorage.setItem('guestUsage', JSON.stringify(guestData));
      setDailyUsage(minutes);
    }
  };

  const resetDailyUsage = () => {
    setSessionTime(0);
    setDailyUsage(0);
    setIsTimeUp(false);
    setShowUpgradeModal(false);
  };

  return {
    sessionTime,
    dailyUsage,
    isTimeUp,
    showUpgradeModal,
    setShowUpgradeModal,
    resetDailyUsage,
    remainingMinutes: DAILY_FREE_MINUTES - dailyUsage
  };
};
