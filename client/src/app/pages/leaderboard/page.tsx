"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useRouter } from "next/navigation";

export default function Leaderboard() {
  const [tabledata, settabledata] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredusers, setFilteredUsers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        settabledata(data.data);
        setFilteredUsers(data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
  };

  useEffect(() => {
    const filteredItems = tabledata.filter((data) =>
      data.name.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  }, [searchItem, tabledata]);

  const handleNameClick = (name) => {
    router.push("/pages/profile");
  };

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
                value={searchItem}
                onChange={handleInputChange}
                className="border border-white bg-zinc-950 rounded w-full text-white p-2 pl-10"
              />
            </div>
          </form>
          {/*
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
          */}
        </div>

        <div className="w-11/12 sm:w-4/5 max-w-3xl pb-10">
          <div className="bg-zinc-900 overflow-x-auto border border-white rounded-md shadow-xl shadow-zinc-950">
            <Table className="min-w-[320px] w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] pl-4 sm:pl-10 pr-4 sm:pr-10">
                    Rank
                  </TableHead>
                  <TableHead className="text-center">User Name</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-10">
                    WPM
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredusers.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="pl-4 sm:pl-10 pr-4 sm:pr-10">
                      {index + 1 || "-"}
                    </TableCell>
                    <TableCell
                      className="text-center whitespace-nowrap"
                      onClick={() => handleNameClick(data.name)}
                      role="button"
                    >
                      {data.name || "-"}
                    </TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TableCell className="text-right pr-4 sm:pr-10">
                          <TooltipTrigger>{data.wpm || "-"}</TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            align="center"
                            className="bg-black border border-black text-white px-3 py-2 "
                          >
                            {" "}
                            {`Accuracy: ${data.acc} %`}
                          </TooltipContent>
                        </TableCell>
                      </Tooltip>
                    </TooltipProvider>
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
