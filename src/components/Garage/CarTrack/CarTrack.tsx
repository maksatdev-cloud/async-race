import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setSelectedCar,
  deleteCarThunk,
  clearCarState,
  markCarFinished,
  reportRaceWinnerThunk,
  markCarBroken,
} from "../../../features/garage/garageSlice";
import type { Car } from "../../../types";
import Button from "../../../ui/Button/Button";
import CarImage from "../CarImage";
import * as api from "../../../api/index";
import "./CarTrack.css";
import { useEffect, useRef, useState } from "react";

interface CarTrackProps {
  car: Car;
}

const CarTrack = ({ car }: CarTrackProps) => {
  const dispatch = useAppDispatch();

  const [isStarted, setIsStarted] = useState(false);

  const { isRacing, isRaceFinished, finishedCars, brokenCars } = useAppSelector(
    (state) => {
      const currentPage = state.garage.page;
      return (
        state.garage.pageStates[currentPage] || {
          isRacing: false,
          isRaceFinished: false,
          winner: null,
          finishedCars: {},
          brokenCars: {},
        }
      );
    },
  );

  const isFinished = car.id in finishedCars;
  const isBroken = car.id in brokenCars;
  const isEngineRunning = isStarted || isFinished;

  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRacing && !isRaceFinished && !isStarted && !isFinished && !isBroken) {
      handleStart();
    }
  }, [isRacing, isRaceFinished]);

  useEffect(() => {
    const updatePosition = () => {
      if (isFinished && carRef.current && trackRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const carWidth = carRef.current.offsetWidth;
        carRef.current.style.transform = `translateX(${trackWidth - carWidth - 100}px)`;
      } else if (!isStarted && !isFinished && carRef.current) {
        carRef.current.style.transform = `translateX(0px)`;
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [isFinished, isStarted]);

  useEffect(() => {
    if (!isRacing && isStarted) {
      handleStop();
    }
  }, [isRacing]);

  const startAnimation = (timeMs: number) => {
    if (!trackRef.current || !carRef.current) return;

    const trackWidth = trackRef.current.offsetWidth;
    const carWidth = carRef.current.offsetWidth;
    const distanceToFinish = trackWidth - carWidth - 100;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / timeMs, 1);

      const currentX = progress * distanceToFinish;
      if (carRef.current) {
        carRef.current.style.transform = `translateX(${currentX}px)`;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleStart = async () => {
    try {
      setIsStarted(true);
      dispatch(clearCarState(car.id));

      const { velocity, distance } = await api.startEngine(car.id);
      const timeMs = Math.round(distance / velocity);

      startAnimation(timeMs);
      await api.driveMode(car.id);

      const timeInSec = Number((timeMs / 1000).toFixed(2));
      dispatch(markCarFinished({ id: car.id, time: timeInSec }));

      if (isRacing) {
        dispatch(
          reportRaceWinnerThunk({
            id: car.id,
            name: car.name,
            time: timeInSec,
          }),
        );
      }
    } catch (error) {
      dispatch(markCarBroken(car.id));
      stopAnimation();
    }
  };

  const handleStop = async () => {
    stopAnimation();
    setIsStarted(false);
    dispatch(clearCarState(car.id));

    if (carRef.current) {
      carRef.current.style.transform = `translateX(0px)`;
    }
    await api.stopEngine(car.id);
  };

  return (
    <div className="car-track">
      <div className="car-track-controls">
        <Button
          variant="primary"
          onClick={() => dispatch(setSelectedCar(car))}
          disabled={isEngineRunning}
        >
          SELECT
        </Button>
        <Button
          variant="danger"
          onClick={() => dispatch(deleteCarThunk(car.id))}
          disabled={isEngineRunning}
        >
          REMOVE
        </Button>
        <span className="car-name">
          {car.name}{" "}
          {isBroken && <span style={{ color: "red" }}> (BROKEN)</span>}
        </span>
      </div>

      <div className="car-track-engine">
        <Button
          variant="success"
          className="engine-btn"
          onClick={handleStart}
          disabled={isEngineRunning}
        >
          A
        </Button>
        <Button
          variant="warning"
          className="engine-btn"
          onClick={handleStop}
          disabled={!isEngineRunning}
        >
          B
        </Button>
      </div>

      <div className="track-area" ref={trackRef}>
        <div className="car-container" ref={carRef}>
          <CarImage color={car.color} />
        </div>
        <div className="finish-line"></div>
      </div>
    </div>
  );
};

export default CarTrack;
