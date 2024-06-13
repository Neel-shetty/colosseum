import Link from "next/link";
import Login from "./login/page";

export default function Home() {
  return (
    <>
    <Login/>
   <Link href="./pages/leaderboard">go to leaderboard</Link>
   
    </>
   
  );
}
