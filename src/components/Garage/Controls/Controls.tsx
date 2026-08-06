import { useState, useEffect, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  createCarThunk,
  deleteAllCarsThunk,
  generateCarsThunk,
  resetRaceState,
  resetRaceThunk,
  startRaceState,
  // startRaceThunk,
  updateCarThunk,
} from "../../../features/garage/garageSlice";
import * as api from "../../../api/index";
import Button from "../../../ui/Button/Button";
import "./Controls.css";

// interface ControlsProps {
//   onRace?: () => void;
// }

const Controls = () => {
  const dispatch = useAppDispatch();
  const selectedCar = useAppSelector((state) => state.garage.selectedCar);
  const loading = useAppSelector((state) => state.garage.loading);
  const totalCount = useAppSelector((state) => state.garage.totalCount);
  const cars = useAppSelector((state) => state.garage.cars);

  const isRacing = useAppSelector((state) => {
    const currentPage = state.garage.page;
    return state.garage.pageStates[currentPage]?.isRacing || false;
  });

  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState("#ffffff");

  const [updateName, setUpdateName] = useState("");
  const [updateColor, setUpdateColor] = useState("#ffffff");

  useEffect(() => {
    if (selectedCar) {
      setUpdateName(selectedCar.name);
      setUpdateColor(selectedCar.color);
    } else {
      setUpdateName("");
      setUpdateColor("#ffffff");
    }
  }, [selectedCar]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    dispatch(createCarThunk({ name: createName, color: createColor }));
    setCreateName("");
    setCreateColor("#ffffff");
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCar || !updateName.trim()) return;

    dispatch(
      updateCarThunk({
        id: selectedCar.id,
        car: { name: updateName, color: updateColor },
      }),
    );
    setUpdateName("");
    setUpdateColor("#ffffff");
  };

  const handleGenerate = () => {
    dispatch(generateCarsThunk());
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete ALL cars?")) {
      dispatch(deleteAllCarsThunk());
    }
  };

  return (
    <div className="controls-container">
      <form onSubmit={handleCreate} className="controls-form">
        <input
          type="text"
          placeholder="Type car brand"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          disabled={isRacing}
        />
        <input
          type="color"
          value={createColor}
          onChange={(e) => setCreateColor(e.target.value)}
          disabled={isRacing}
        />
        <Button type="submit" variant="success" disabled={isRacing}>
          CREATE
        </Button>
      </form>

      <form onSubmit={handleUpdate} className="controls-form">
        <input
          type="text"
          placeholder="Update car"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          disabled={!selectedCar || isRacing}
        />
        <input
          type="color"
          value={updateColor}
          onChange={(e) => setUpdateColor(e.target.value)}
          disabled={!selectedCar || isRacing}
        />
        <Button
          type="submit"
          variant="warning"
          disabled={!selectedCar || isRacing}
        >
          UPDATE
        </Button>
      </form>

      <div className="action-buttons">
        <Button
          variant="success"
          onClick={() => dispatch(startRaceState())}
          disabled={loading || cars.length === 0 || isRacing}
        >
          RACE
        </Button>

        <Button
          variant="danger"
          onClick={() => dispatch(resetRaceThunk())}
          disabled={!isRacing}
        >
          RESET
        </Button>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={loading || isRacing}
        >
          GENERATE CARS
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteAll}
          disabled={loading || totalCount === 0 || isRacing}
        >
          CLEAR GARAGE
        </Button>
      </div>
    </div>
  );
};

export default Controls;
