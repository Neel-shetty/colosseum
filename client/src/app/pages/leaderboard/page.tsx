import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Protectedroutes from "@/app/protectedroutes";
import {
  faMagnifyingGlass,
  faGlobe,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tabledata = [
  { rank: "1", UserName: "neel<developer>", points: "1234" },
  { rank: "2", UserName: "Krupal.404devNotFound", points: "234" },
  { rank: "3", UserName: "test3", points: "34" },
  { rank: "", UserName: "", points: "" },
  { rank: "", UserName: "", points: "" },
  { rank: "", UserName: "", points: "" },
  { rank: "", UserName: "", points: "" },
  { rank: "", UserName: "", points: "" },
  { rank: "", UserName: "", points: "" },
  
];

export default function Leaderboard() {
  return (
    <Protectedroutes>
      <div className="flex flex-col items-center bg-bg-color pt-10 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 w-11/12 sm:w-4/5 max-w-3xl">
          <form action="" className="flex-grow">
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 text-white h-5 w-5"
              />
              <input
                type="text"
                placeholder="Search"
                className="border border-white bg-zinc-950 rounded w-full text-white p-2 pl-10"
              />
            </div>
          </form>
          <Button
            variant="secondary"
            className="bg-white text-black flex items-center justify-center space-x-2 p-2"
          >
            <FontAwesomeIcon icon={faGlobe} className="text-black h-5 w-5" />
            <span>Global</span>
          </Button>
          <Button
            variant="default"
            className="bg-zinc-950 border border-white rounded text-white flex items-center justify-center space-x-2 p-2"
          >
            <FontAwesomeIcon icon={faList} className="text-white h-5 w-5" />
            <span>Categories</span>
          </Button>
        </div>

        <div className="w-11/12 sm:w-4/5 max-w-3xl pb-10">
          <div className="bg-zinc-900 overflow-x-auto border border-white rounded-md shadow-xl shadow-zinc-950">
            <Table className="min-w-[320px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] pl-4 sm:pl-10 pr-4 sm:pr-10">Rank</TableHead>
                  <TableHead className="text-center">User Name</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-10">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tabledata.map((data) => (
                  <TableRow key={data.rank}>
                    <TableCell className="pl-4 sm:pl-10 pr-4 sm:pr-10">
                      {data.rank}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      {data.UserName || "-"}
                    </TableCell>
                    <TableCell className="text-right pr-4 sm:pr-10">
                      {data.points || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Protectedroutes>
  );
}
