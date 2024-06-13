import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  {
    rank: "1",
    UserName: "neel<developer>",
    points: "1234",
  },
  {
    rank: "2",
    UserName: "Krupal.404devNotFound",
    points: "234",
  },
  {
    rank: "3",
    UserName: "test3",
    points: "34",
  },
  {
    rank: "4",
    UserName: "",
    points: "",
  },
  {
    rank: "5",
    UserName: "",
    points: "",
  },
  {
    rank: "6",
    UserName: "",
    points: "",
  },
  {
    rank: "7",
    UserName: "",
    points: "",
  },
  {
    rank: "8",
    UserName: "",
    points: "",
  },
  {
    rank: "9",
    UserName: "",
    points: "",
  },
  {
    rank: "10",
    UserName: "",
    points: "",
  },
  {
    rank: "11",
    UserName: "",
    points: "",
  },
];

export default function Leaderboard() {
  return (
    <div className="flex flex-col items-center bg-bg-color pt-20 space-y-6 w-full">
      <div className="flex space-x-3 w-4/5 max-w-3xl">
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
          className="bg-white text-black flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faGlobe} className="text-black h-5 w-5" />
          <span>Global</span>
        </Button>
        <Button
          variant="default"
          className="bg-zinc-950 border border-white rounded text-white flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faList} className="text-white h-5 w-5" />
          <span>Categories</span>
        </Button>
      </div>
      <div className="w-4/5 max-w-3xl pb-10 ">
        <div className="bg-zinc-900  overflow-hidden border border-white rounded-md shadow-xl shadow-zinc-950  ">
          <Table className="pt-10 w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] pl-10 pr-10">Rank</TableHead>
                <TableHead className="text-center">User Name</TableHead>
                <TableHead className="text-right  pr-10">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tabledata.map((tabledata) => (
                <TableRow key={tabledata.rank}>
                  <TableCell className="pl-10 pr-10">
                    {tabledata.rank}
                  </TableCell>
                  <TableCell className="text-center">
                    {tabledata.UserName}
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    {tabledata.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
