import { useState, useEffect, useCallback, useRef } from 'react';
import type { OutpostLocation, OutpostResources, OutpostModule, CrisisEvent, ResourceDeltas } from '../types/trainer';
import { INITIAL_MODULES, CRISIS_CATALOG } from '../utils/nasaData';
import { soundManager } from '../utils/soundEffects';

interface SimulationState {
  location: OutpostLocation;
  resources: OutpostResources;
  deltas: ResourceDeltas;
  modules: OutpostModule[];
  stabilityScore: number;
  missionTime: number; // in seconds
  speed: 1 | 2 | 5;
  isPaused: boolean;
  activeCrisis: CrisisEvent | null;
  crisisTimer: number;
  crisesResolvedCount: number;
}

const INITIAL_RESOURCES: OutpostResources = {
  oxygen: 94,
  water: 88,
  power: 96,
  food: 90,
  shielding: 85,
  morale: 100,
};

export function useMissionSimulation(initialLocation: OutpostLocation = 'lunar') {
  const [location, setLocation] = useState<OutpostLocation>(initialLocation);
  const [resources, setResources] = useState<OutpostResources>(INITIAL_RESOURCES);
  const [modules, setModules] = useState<OutpostModule[]>(INITIAL_MODULES);
  const [missionTime, setMissionTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCrisis, setActiveCrisis] = useState<CrisisEvent | null>(null);
  const [crisisTimer, setCrisisTimer] = useState<number>(0);
  const [crisesResolvedCount, setCrisesResolvedCount] = useState(0);

  // Calculate dynamic deltas based on operational modules and planetary conditions
  const calculateDeltas = useCallback((): ResourceDeltas => {
    // Base baseline human consumption (crew of 4 astronauts)
    let o2Rate = -1.2;
    let waterRate = -1.0;
    let foodRate = -0.8;
    let powerRate = -2.0;
    let shieldRate = location === 'lunar' ? -0.4 : -0.2; // Lunar South Pole has higher solar particle exposure
    let moraleRate = 0.0;

    // Sum operational module outputs
    modules.forEach((mod) => {
      if (mod.status === 'operational') {
        powerRate += mod.powerOutput - mod.powerCost;
        o2Rate += mod.o2Output;
        waterRate += mod.waterOutput;
        foodRate += mod.foodOutput;
        shieldRate += mod.shieldOutput * 0.05;
      } else if (mod.status === 'damaged') {
        powerRate -= mod.powerCost * 0.5; // Drain while leaking
      }
    });

    // Environmental solar penalty for Mars (lower solar flux)
    if (location === 'mars') {
      powerRate -= 1.5;
    }

    // Morale consequences of failing life support
    if (resources.oxygen < 30 || resources.water < 25 || resources.power < 20) {
      moraleRate -= 2.5;
    } else if (resources.food > 70 && resources.oxygen > 80) {
      moraleRate += 0.5;
    }

    return {
      oxygen: Number(o2Rate.toFixed(2)),
      water: Number(waterRate.toFixed(2)),
      power: Number(powerRate.toFixed(2)),
      food: Number(foodRate.toFixed(2)),
      shielding: Number(shieldRate.toFixed(2)),
      morale: Number(moraleRate.toFixed(2)),
    };
  }, [modules, location, resources.oxygen, resources.water, resources.power, resources.food]);

  const deltas = calculateDeltas();

  // Overall outpost health/stability index (0 - 100)
  const stabilityScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        resources.oxygen * 0.3 +
        resources.water * 0.2 +
        resources.power * 0.25 +
        resources.food * 0.1 +
        resources.shielding * 0.15
      )
    )
  );

  // Toggle module state (operational / offline / repair)
  const toggleModuleStatus = (id: string) => {
    soundManager.playBeep(720, 0.05);
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = m.status === 'operational' ? 'offline' : 'operational';
        return { ...m, status: nextStatus };
      })
    );
  };

  // Repair a damaged module
  const repairModule = (id: string) => {
    soundManager.playSuccessChime();
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'operational' } : m))
    );
  };

  // Switch between Moon and Mars
  const switchLocation = (newLoc: OutpostLocation) => {
    soundManager.playBeep(520, 0.1);
    setLocation(newLoc);
    // Adjust environmental module parameters
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === 'mod-solar') {
          return {
            ...m,
            powerOutput: newLoc === 'lunar' ? 24 : 14, // Mars receives ~43% sunlight compared to Moon
          };
        }
        return m;
      })
    );
  };

  // Trigger random crisis
  const triggerRandomCrisis = useCallback(() => {
    if (activeCrisis) return;
    const randomCrisis = CRISIS_CATALOG[Math.floor(Math.random() * CRISIS_CATALOG.length)];
    setActiveCrisis(randomCrisis);
    setCrisisTimer(randomCrisis.countdown);
    soundManager.playAlertSiren();
  }, [activeCrisis]);

  // Resolve active crisis
  const resolveCrisis = (effects: Partial<OutpostResources>, solved: boolean) => {
    if (solved) {
      soundManager.playSuccessChime();
      setCrisesResolvedCount((c) => c + 1);
    } else {
      soundManager.playBeep(220, 0.3, 'sawtooth');
    }

    setResources((prev) => ({
      oxygen: Math.min(100, Math.max(5, prev.oxygen + (effects.oxygen || 0))),
      water: Math.min(100, Math.max(5, prev.water + (effects.water || 0))),
      power: Math.min(100, Math.max(5, prev.power + (effects.power || 0))),
      food: Math.min(100, Math.max(5, prev.food + (effects.food || 0))),
      shielding: Math.min(100, Math.max(5, prev.shielding + (effects.shielding || 0))),
      morale: Math.min(100, Math.max(5, prev.morale + (effects.morale || 0))),
    }));

    setActiveCrisis(null);
  };

  // Simulation Tick Loop
  const crisisCheckRef = useRef(0);
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setMissionTime((t) => t + 1);

      // Decrement crisis countdown if active
      if (activeCrisis) {
        setCrisisTimer((prev) => {
          if (prev <= 1) {
            // Crisis timed out without action!
            soundManager.playAlertSiren();
            resolveCrisis({ power: -15, morale: -20, shielding: -10 }, false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Chance of triggering a crisis every 45-60 seconds of mission time
        crisisCheckRef.current += 1;
        if (crisisCheckRef.current >= 45 && Math.random() < 0.25) {
          crisisCheckRef.current = 0;
          triggerRandomCrisis();
        }
      }

      // Update resource bars
      setResources((prev) => ({
        oxygen: Math.min(100, Math.max(0, prev.oxygen + deltas.oxygen * 0.1)),
        water: Math.min(100, Math.max(0, prev.water + deltas.water * 0.1)),
        power: Math.min(100, Math.max(0, prev.power + deltas.power * 0.1)),
        food: Math.min(100, Math.max(0, prev.food + deltas.food * 0.1)),
        shielding: Math.min(100, Math.max(0, prev.shielding + deltas.shielding * 0.05)),
        morale: Math.min(100, Math.max(0, prev.morale + deltas.morale * 0.1)),
      }));
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [isPaused, speed, deltas, activeCrisis, triggerRandomCrisis]);

  return {
    state: {
      location,
      resources,
      deltas,
      modules,
      stabilityScore,
      missionTime,
      speed,
      isPaused,
      activeCrisis,
      crisisTimer,
      crisesResolvedCount,
    } as SimulationState,
    actions: {
      setSpeed,
      setIsPaused,
      switchLocation,
      toggleModuleStatus,
      repairModule,
      triggerRandomCrisis,
      resolveCrisis,
      resetSimulation: () => {
        setResources(INITIAL_RESOURCES);
        setModules(INITIAL_MODULES);
        setMissionTime(0);
        setActiveCrisis(null);
      },
    },
  };
}
