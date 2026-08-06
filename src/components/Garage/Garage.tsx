import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCars, setPage } from "../../features/garage/garageSlice";
import Button from "../../ui/Button/Button";
import Controls from "./Controls/Controls";
import CarTrack from "./CarTrack/CarTrack";
import { startEngine, driveCar } from "../../api/engine";
import type { Car } from "../../types";
import Modal from "../../ui/Modal/Modal";
import "./Garage.css";
import { clearWinner } from "../../features/garage/garageSlice";

const Garage = () => {
  const dispatch = useAppDispatch();
  const { cars, totalCount, page, loading, pageStates } = useAppSelector(
    (state) => state.garage,
  );

  const currentPageState = pageStates[page] || {
    isRacing: false,
    winner: null,
    isRaceFinished: false,
    finishedCars: {},
    brokenCars: {},
  };

  const { winner, isRacing, isRaceFinished } = currentPageState;

  const LIMIT = 7;

  const lastPage = Math.ceil(totalCount / LIMIT) || 1;

  useEffect(() => {
    dispatch(fetchCars(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      dispatch(setPage(newPage));
      
    }
  };

  
  const handleCloseModal = () => {
    dispatch(clearWinner());
  };

  const isRaceActive = isRacing && !isRaceFinished;

  return (
    <div className="garage-container">
      <Controls />

      <div className="garage-header">
        <h2>Garage ({totalCount})</h2>
        <h3>Page #{page}</h3>
      </div>

      <div className="garage-track-list">
        {cars.length === 0 ? (
          <div className="garage-empty">
            <p>Garage is empty</p>
            <span className="garage-empty__subtitle">
              Create custom cars or use "Generate Cars" to start the race
            </span>
          </div>
        ) : (
          cars.map((car) => <CarTrack key={car.id} car={car} />)
        )}
      </div>

      <Modal isOpen={!!winner} onClose={handleCloseModal}>
        {winner && (
          <>
            <h2 className="winner-message">🏆 {winner.name} went first!</h2>
            <p className="winner-time">Time: {winner.time}s</p>
          </>
        )}
      </Modal>

      <div className="pagination-controls">
        <Button
          variant="primary"
          onClick={() => handlePageChange(1)}
          disabled={page === 1 || loading || isRaceActive}
        >
          FIRST
        </Button>

        <Button
          variant="primary"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading || isRaceActive}
        >
          PREV
        </Button>

        <span className="page-indicator">
          {page} / {lastPage}
        </span>

        <Button
          variant="primary"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === lastPage || loading || isRaceActive}
        >
          NEXT
        </Button>

        <Button
          variant="primary"
          onClick={() => handlePageChange(lastPage)}
          disabled={page === lastPage || loading || isRaceActive}
        >
          LAST
        </Button>
      </div>
    </div>
  );
};

export default Garage;
