import { useLazyFetchLazyVisitorsQuery } from "../../store/slices/api/visitorsApi";

const SearchBar = ({
  triggerUserBorrowHistory,
  userBorrowHistoryQuery,
  setUserBorrowHistoryQuery,
}) => {
  const [triggerFetchVisitors, { data: visitorOptions = [] }] =
    useLazyFetchLazyVisitorsQuery();

  const handleVisitorSearch = (query) => {
    setUserBorrowHistoryQuery(query);
    if (query) {
      triggerFetchVisitors(query);
    }
  };

  const clear = () => {
    setUserBorrowHistoryQuery("");
    triggerUserBorrowHistory("");
  };

  const fetchUserBorrowHistory = () => {
    if (userBorrowHistoryQuery.trim()) {
      triggerUserBorrowHistory(userBorrowHistoryQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchUserBorrowHistory();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search User Borrow History..."
        value={userBorrowHistoryQuery}
        onChange={(e) => handleVisitorSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        list="visitor-options"
        className="border rounded px-4 py-2"
      />
      <datalist id="visitor-options">
        {visitorOptions.map((visitor) => (
          <option key={visitor.id} value={visitor.name} />
        ))}
      </datalist>
      <button
        onClick={clear}
        className="bg-red-400 text-white px-4 py-2 rounded"
      >
        Clear
      </button>
      <button
        onClick={fetchUserBorrowHistory} // Trigger search on button click
        className="bg-blue-950 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
