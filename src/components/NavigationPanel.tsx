import React from "react";
import { Button } from "./ui/button";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";

export default function NavigationPanel() {
  return (
    <div className="w-full flex justify-evenly gap-2">
      <Button variant="outline" className="w-16">
        <ChevronFirst className="h-5 w-5" />
      </Button>
      <Button variant={"outline"} className="w-16">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button variant={"outline"} className="w-16">
        <ChevronRight className="h-5 w-5" />
      </Button>
      <Button variant={"outline"} className="w-16">
        <ChevronLast className="h-5 w-5" />
      </Button>
      <Button variant={"outline"} className="w-16">
        <Save className="h-5 w-5" />
      </Button>
    </div>
  );
}
