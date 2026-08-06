import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"; 
import {
  fetchWinnersThunk,
  setWinnersPage,
  setSorting,
} from "../../features/winners/winnersSlice";
import Button from "../../ui/Button/Button";
import CarImage from "../Garage/CarImage"; 
import "./Winners.css";

const Winners = () => {
  const dispatch = useAppDispatch();
  const { items, totalCount, page, sort, order, loading } = useAppSelector(
    (state) => state.winners,
  );

  const LIMIT = 10;
  const lastPage = Math.ceil(totalCount / LIMIT) || 1;

  useEffect(() => {
    dispatch(fetchWinnersThunk());
  }, [dispatch, page, sort, order]);

  const handleSort = (field: "wins" | "time") => {
    dispatch(setSorting(field));
  };

  const renderSortIcon = (field: "wins" | "time") => {
    if (sort !== field) return null;
    return order === "ASC" ? " ↑" : " ↓";
  };

  return (
    <div className="winners-container">
      <div className="winners-header">
        <h2>Winners ({totalCount})</h2>
        <h3>Page #{page}</h3>
      </div>

      <table className="winners-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Car</th>
            <th>Name</th>
            <th
              className="sortable-col"
              onClick={() => handleSort("wins")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Wins {renderSortIcon("wins")}
            </th>
            <th
              className="sortable-col"
              onClick={() => handleSort("time")}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Best time (seconds) {renderSortIcon("time")}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          ) : (
            items.map((winner, index) => (
              <tr key={winner.id}>
                <td>{(page - 1) * LIMIT + index + 1}</td>
                <td>
                  <CarImage color={winner.car?.color || "#ffffff"} />
                </td>
                <td>{winner.car?.name || "Unknown Car"}</td>
                <td>{winner.wins}</td>
                <td>{winner.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <Button
          variant="primary"
          disabled={page === 1}
          onClick={() => dispatch(setWinnersPage(page - 1))}
        >
          PREV
        </Button>
        <span className="page-indicator">
          {page} / {lastPage}
        </span>
        <Button
          variant="primary"
          disabled={page >= lastPage}
          onClick={() => dispatch(setWinnersPage(page + 1))}
        >
          NEXT
        </Button>
      </div>
    </div>
  );
};

export default Winners;
