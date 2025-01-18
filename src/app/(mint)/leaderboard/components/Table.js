import React, { useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, getKeyValue } from "@nextui-org/react";
import { trimName, trimAddress } from "../utils/trimmer";

export default function TableMapper({ data, isLoading, pageCount, fetchData, pageSize }) {
  const [page, setPage] = React.useState(1);

  const loadingState = isLoading || data[0]?.leaderboards?.length === 0 ? "loading" : "idle";

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData({ pageIndex: newPage - 1, pageSize });
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (!data) return null;

  return (
    <Table
      aria-label="Point leaderboard"
      bottomContent={
        pageCount > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pageCount}
              onChange={handlePageChange}
            />
          </div>
        ) : null
      }
    >
      <TableHeader className="w-full h-20 text-center !bg-lightgreen">
        <TableColumn key="rank" className="text-center">Rank</TableColumn>
        <TableColumn key="name" className="text-center">Name</TableColumn>
        <TableColumn key="points" className="text-center">Points</TableColumn>
      </TableHeader>

      <TableBody
      items={[data[0]?.currentUser, ...(data[0]?.leaderboard || [])].filter(Boolean)}
      loadingContent={<Spinner />}
      loadingState={loadingState}
    >
      {([data[0]?.currentUser, ...(data[0]?.leaderboard || [])].filter(Boolean)).map((item, index) => (
        <TableRow
          key={item?.id || item?.rank}
          className={`${index % 2 === 0 ? 'bg-neutral-200' : 'bg-white'} rounded-xl`}
        > 
          {(columnKey) => (
            <TableCell className="text-black text-center">
              {(() => {
                if (item === data[0]?.currentUser) {
                  // Do not trim name and address for currentUser
                  switch (columnKey) {
                    case "rank":
                      return item.rank;
                    case "name":
                      return (
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-gray-500 text-sm">{trimAddress(item.address)}</span>
                        </div>
                      );
                    case "points":
                      return item.points;
                    default:
                      return null;
                  }
                } else {
                  // Apply trimming for other items
                  switch (columnKey) {
                    case "rank":
                      return item.rank;
                    case "name":
                      return (
                        <div className="flex flex-col">
                          <span>{trimName(item.name)}</span>
                          <span className="text-gray-500 text-sm">{trimAddress(item.address)}</span>
                        </div>
                      );
                    case "points":
                      return item.points;
                    default:
                      return null;
                  }
                }
              })()}
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
    </Table>
  );
}
