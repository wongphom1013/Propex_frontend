/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { trimName, trimAddress } from "../utils/trimmer";
import { Pagination } from "@nextui-org/react";
import { useDebounceCallback } from "usehooks-ts";
import Image from "next/image";
import { useAnimate, motion } from "framer-motion";
import { cnm } from "@/utils/style";

export default function TableMapper({
  data,
  pageCount,
  fetchData,
  page,
  setPage,
  pageSize,
  currentUser,
  setPageSize,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedData, setDisplayedData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [scope, animate] = useAnimate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 680);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData({ pageIndex: newPage - 1, pageSize });
  };

  // Handle Page size change (incrementation of data)
  const handleChangePageSize = (event) => {
    const newSize = Number(event.target.value);
    setPageSize(newSize);
    fetchData({ pageIndex: 0, pageSize: newSize });
  };

  // Handle search input change (update searchTerm immediately)
  // const handleSearchChange = (event) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);
  //   debounceUpdateSuggestions(value);
  // };

  // Debounced function to update suggestions
  // const debounceUpdateSuggestions = useDebounceCallback((term) => {
  //   updateSuggestions(term);
  // }, 300);

  // Update suggestions based on search term
  // const updateSuggestions = (term) => {
  //   if (!term) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   const allNames = (data[0]?.leaderboard || []).map((item) => item.name);
  //   if (data[0]?.currentUser) {
  //     allNames.push(data[0].currentUser.name);
  //   }

  //   const filteredSuggestions = allNames.filter((name) =>
  //     name.toLowerCase().includes(term.toLowerCase())
  //   );

  //   setSuggestions(filteredSuggestions);
  // };

  // Handle selection of a suggestion
  // const handleSuggestionClick = (suggestion) => {
  //   setSearchTerm(suggestion);
  //   setSelectedSuggestion(suggestion);
  //   setSuggestions([]);
  //   updateDisplayedData(suggestion);
  // };

  // // Handle Enter key press
  // const handleKeyPress = (event) => {
  //   if (event.key === "Enter" && selectedSuggestion) {
  //     updateDisplayedData(searchTerm);
  //   }
  // };

  // Update displayed data based on search term or selected suggestion
  // const updateDisplayedData = (term) => {
  //   if (!data) return [];

  //   if (!term) {
  //     // Show all data if no search term
  //     const allLeaderboard = data[0]?.leaderboard || [];
  //     const currentUser = data[0]?.currentUser;
  //     const currentUserExists = allLeaderboard.some(
  //       (item) => item.id === currentUser?.id
  //     );
  //     const allData =
  //       currentUser && !currentUserExists
  //         ? [currentUser, ...allLeaderboard]
  //         : allLeaderboard;
  //     setDisplayedData(allData);
  //   } else {
  //     // Filter leaderboard items based on search term
  //     const filteredLeaderboard = (data[0]?.leaderboard || []).filter((item) =>
  //       item.name.toLowerCase().includes(term.toLowerCase())
  //     );

  //     setDisplayedData([...filteredLeaderboard]);
  //   }
  // };

  // useEffect(() => {
  //   updateDisplayedData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

  // useEffect(() => {
  //   if (selectedSuggestion) {
  //     updateDisplayedData(selectedSuggestion);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedSuggestion]);

  useEffect(() => {
    if (scope.current && searchTerm) {
      animate(scope.current, { height: "auto", opacity: 1 }, { duration: 3 });
    } else if (scope.current && !searchTerm) {
      animate(scope.current, { height: 0, opacity: 0 }, { duration: 3 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  if (!data) return null;

  switch (isMobile) {
    case true:
      // Render mobile
      return (
        <MobileVersion
          currentUser={currentUser}
          pageSize={pageSize}
          handleChangePageSize={handleChangePageSize}
          searchTerm={searchTerm}
          // handleSearchChange={handleSearchChange}
          // handleKeyPress={handleKeyPress}
          suggestions={suggestions}
          // handleSuggestionClick={handleSuggestionClick}
          displayedData={data}
          pageCount={pageCount}
          page={page}
          handlePageChange={handlePageChange}
        />
      );
    case false:
      return (
        <DesktopVersion
          currentUser={currentUser}
          pageSize={pageSize}
          handleChangePageSize={handleChangePageSize}
          searchTerm={searchTerm}
          // handleSearchChange={handleSearchChange}
          // handleKeyPress={handleKeyPress}
          suggestions={suggestions}
          // handleSuggestionClick={handleSuggestionClick}
          displayedData={data}
          pageCount={pageCount}
          page={page}
          handlePageChange={handlePageChange}
        />
      );
  }
}

const MobileVersion = ({
  pageSize,
  handleChangePageSize,
  searchTerm,
  handleSearchChange,
  handleKeyPress,
  suggestions,
  handleSuggestionClick,
  displayedData,
  pageCount,
  page,
  currentUser,
  handlePageChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full relative text-black">
      <div className="w-full h-full border-t border-black border-opacity-10 rounded-t-2xl overflow-hidden bg-white p-3">
        {/* Table and Search Bar Container */}
        {/* <div className="flex justify-between items-center p-4">
          {!isFocused && (
            <motion.div
              initial={{ opacity: 0, translateX: -20 }} // Start off to the left
              animate={{ opacity: 1, translateX: 0 }} // Slide in
              exit={{ opacity: 0, translateX: -20 }} // Slide out to the left
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex justify-end items-center gap-2"
            >
              <span>Show</span>
              <select
                value={pageSize}
                onChange={handleChangePageSize}
                className="border border-gray-300 rounded-lg p-2 pr-4"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <span>Ranker</span>
            </motion.div>
          )}

          <div className="relative flex justify-end w-full transition-all duration-300 ease-in-out">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full p-2 pl-4 border border-gray-300 rounded-2xl outline-none transition-all duration-300 ease-in-out ${
                isFocused ? "max-w-[100%]" : "max-w-[80%]"
              }`}
            />

            {suggestions.length > 0 && (
              <motion.div
                className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <ul className="max-h-60 overflow-auto scrollbar-hide">
                  {suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="p-2 pl-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                      whileHover={{ scale: 1.02 }}
                    >
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div> */}

        {/* Table Header */}
        <div className="rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-3 gap-4 text-center bg-lemongrass-50/50 p-6 rounded-tl-2xl rounded-tr-2xl">
            <div className="font-bold">Rank</div>
            <div className="font-bold">Name</div>
            <div className="font-bold">Points</div>
          </div>

          {/* Table Rows */}
          <div className="relative">
            <div className="sticky top-0 shadow-lg grid grid-cols-3 gap-4 justify-items-center place-items-center p-2 w-full h-16 bg-white z-10">
              <div className="flex justify-center items-center">
                {currentUser.rank}
              </div>
              <div className="flex flex-col justify-center items-center text-sm">
                <span>{currentUser.name}</span>
                <span className="text-gray-500 text-xs">
                  {trimAddress(currentUser.address)}
                </span>
              </div>
              <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1">
                <div className="relative w-4 h-4">
                  <Image
                    src={"/assets/logo/propex-coin.png"}
                    alt="propex-coin"
                    fill
                    sizes="350px"
                    className="object-contain"
                  />
                </div>
                <span className="text-green-600 font-semibold text-sm">
                  {currentUser.points}
                </span>
              </div>
            </div>
            {displayedData?.length > 0 ? (
              displayedData.map((item, idx) => (
                <div
                  key={item?.id || item?.rank}
                  className={cnm(
                    "grid grid-cols-3 gap-4 justify-items-center place-items-center p-2 w-full h-16 bg-white border-b border-black border-opacity-10",
                    idx === displayedData.length - 1 ? "" : "border-b",
                    idx % 2 === 0 ? "bg-lemongrass-50/50" : "bg-white"
                  )}
                >
                  <div className="flex justify-center items-center">
                    {item.rank}
                  </div>
                  <div className="flex flex-col justify-center items-center text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-500 text-xs">
                      {trimAddress(item.address)}
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1">
                    <div className="relative w-4 h-4">
                      <Image
                        src={"/assets/logo/propex-coin.png"}
                        alt="propex-coin"
                        fill
                        sizes="350px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-green-600 font-semibold text-sm">
                      {item.points}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center py-8 border-b border-black border-opacity-10 rounded-bl-2xl rounded-br-2xl">
                <span>No Data Available</span>
              </div>
            )}
          </div>
        </div>

        {pageCount > 0 && (
          <div className="flex w-full justify-center mb-4 mt-4">
            <Pagination
              isCompact
              showControls
              showShadow
              classNames={{
                wrapper: "shadow-none gap-1",
                next: "bg-transparent shadow-none",
                prev: "bg-transparent shadow-none",
                item: "bg-transparent shadow-none",
              }}
              page={page}
              total={pageCount}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DesktopVersion = ({
  pageSize,
  handleChangePageSize,
  searchTerm,
  handleSearchChange,
  handleKeyPress,
  suggestions,
  handleSuggestionClick,
  currentUser,
  displayedData,
  pageCount,
  page,
  handlePageChange,
}) => {
  console.log({ currentUser });
  return (
    <div className="w-[calc(100%-6rem)] max-w-[70rem] mb-20 relative text-black">
      <div className="w-full h-full border border-black border-opacity-10 rounded-3xl overflow-hidden bg-white p-6 shadow-xl">
        {/* Table and Search Bar Container */}
        {/* <div className="flex justify-between items-center p-4">
          <div className="flex justify-end items-center gap-2 p-4">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={handleChangePageSize}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <span>Data</span>
          </div>

          <div className="relative flex justify-end w-full max-w-[40%]">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="w-full p-2 pl-4 border border-gray-300 rounded-2xl outline-none"
            />
            {suggestions.length > 0 && (
              <motion.div
                className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{
                  overflow: "hidden",
                }}
              >
                <ul className="max-h-60 overflow-auto scrollbar-hide">
                  {suggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      className="p-2 pl-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = "blur(0px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "blur(0)";
                      }}
                    >
                      {suggestion}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div> */}

        {/* Table Header */}
        <div className="border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 text-center bg-lemongrass-50/50 px-6 py-4 border-b">
            <div className="font-bold">Rank</div>
            <div className="font-bold">Name</div>
            <div className="font-bold">Address</div>
            <div className="font-bold">Points</div>
          </div>

          {/* Table Rows */}
          <div className="w-full h-[40rem] overflow-y-auto relative">
            {/* Current user */}
            <div className="sticky top-0 shadow-lg grid grid-cols-4 gap-4 justify-items-center place-items-center p-2 w-full h-16 bg-white z-10">
              <div className="flex justify-center items-center">
                {currentUser.rank}
              </div>
              <div className="flex flex-col justify-center items-center">
                <span>{currentUser.name}</span>
              </div>
              <div className="flex justify-center items-center">
                <span className="text-gray-500 text-sm">
                  {trimAddress(currentUser.address)}
                </span>
              </div>
              <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1">
                <div className="relative w-4 h-4">
                  <Image
                    src={"/assets/logo/propex-coin.png"}
                    alt="propex-coin"
                    fill
                    sizes="350px"
                    className="object-contain"
                  />
                </div>
                <span className="text-green-600 font-semibold text-sm">
                  {currentUser.points}
                </span>
              </div>
            </div>

            {displayedData?.length > 0 ? (
              displayedData.map((item, idx) => (
                <div
                  key={item?.id || item?.rank}
                  className={cnm(
                    "relative grid grid-cols-4 gap-4 justify-items-center place-items-center p-2 w-full h-16 border-black border-opacity-10",
                    idx === displayedData.length - 1 ? "" : "border-b",
                    idx % 2 === 0 ? "bg-lemongrass-50/50" : "bg-white"
                  )}
                >
                  <div className="flex justify-center items-center gap-1">
                    {item.rank === 1 || item.rank === 2 || item.rank === 3
                      ? "🏆"
                      : ""}
                    <p>{item.rank}</p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span>{item.name}</span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-gray-500 text-sm">
                      {trimAddress(item.address)}
                    </span>
                  </div>
                  <div className="flex justify-center items-center bg-lightgreen rounded-3xl px-4 py-1 gap-1">
                    <div className="relative w-4 h-4">
                      <Image
                        src={"/assets/logo/propex-coin.png"}
                        alt="propex-coin"
                        fill
                        sizes="350px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-green-600 font-semibold text-sm">
                      {item.points}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center py-8 border-b border-black border-opacity-10 rounded-bl-2xl rounded-br-2xl">
                <span>No Data Available</span>
              </div>
            )}
          </div>
        </div>

        {pageCount > 0 && (
          <div className="flex w-full justify-center mt-6">
            <Pagination
              isCompact
              classNames={{
                wrapper: "shadow-none gap-1",
                next: "bg-transparent shadow-none",
                prev: "bg-transparent shadow-none",
                item: "bg-transparent shadow-none",
              }}
              showControls
              showShadow={false}
              page={page}
              total={pageCount}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
