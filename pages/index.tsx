import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button"
import { Dispatch, SetStateAction, useState } from "react";
import Complete from "@/fetch_wrapper/autocomplete";
import FindPath from "@/fetch_wrapper/findpath";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

const [from, setFrom] = useState("");
const [to, setTo] = useState("");
const [fs, setFs] = useState(["Atom", "Autism", "Google", "Meta"]);
const [ts, setTs] = useState([""]);
const [res, setRes] = useState([""]);


const handleSearch = async () =>{
  console.log("handleSearch");
  let result = await FindPath(from, to);
  setRes(result);
}
//todo: implement

const from_handleEnter = (event: React.KeyboardEvent) => {
  console.log("from_handleEnter");
  if (event.key === 'Enter') {
    setFrom(fs[0]); // Set the input value to the first suggestion when Enter is pressed
  }
};
const to_handleEnter = (event: React.KeyboardEvent) => {
  console.log("to_handleEnter");
  if (event.key === 'Enter') {
    setTo(ts[0]); // Set the input value to the first suggestion when Enter is pressed
  }
};

const handleComplete = async(str: string, setter: Dispatch<SetStateAction<string>>)=>{
  setter(str); //set string
  let result = await Complete(str);
  if(setter === setFrom){
    setFs(result);
  }else{
    setTs(result);
  }
}


  return (
    <main>
      <div className="w-screen h-screen flex flex-col">
        <div>
          Wikigraph
        </div>
        <div className="flex justify-center items-center space-x-24 ">
        <Command className="w-96">
          <CommandInput placeholder="From..." value={from} onValueChange={(t)=> handleComplete(t, setFrom)} onKeyDown={from_handleEnter}/>
          <CommandList>
          <CommandGroup heading="Suggestions">
          {
            (fs.length > 0 && from.length > 1) && fs.map((f, i) => <CommandItem key={i} onClick={()=>setFrom(f)}>{f}</CommandItem>)
          }
          </CommandGroup>
          </CommandList>
        </Command>

        <Command className="w-96">
          <CommandInput placeholder="To..." value={to} onValueChange={(t)=> handleComplete(t, setTo)} onKeyDown={to_handleEnter}/>
          <CommandList>
          <CommandGroup heading="Suggestions">
          {
            ts.length > 0 && 
            ts.map((t, i) => <CommandItem key={i} onClick={()=>setTo(t)}>{t}</CommandItem>)
          }
          </CommandGroup>
            </CommandList>
        </Command>

        <Button onClick={handleSearch}>Search</Button>
        </div>

      </div>

    </main>
  );
}
