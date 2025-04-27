
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
  const navItems = [
  //  { title: "Attendance", href: "/view-attendance" },
   // { title: "Attendance", href: "/view-attendance#attendance" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <a href="/view-attendance#attendance" className="text-xl font-bold text-blue-500">
            ATTENDIFY
          </a>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="/view-attendance#attendance">
          <Button
            variant="default"
            className="hidden md:inline-flex bg-blue-500 hover:bg-blue-800"
          >
            View Attendance
          </Button>
          </a>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
                 <a href="/view-attendance#attendance">
                <Button className="w-full bg-blue-500 hover:bg-purple-800">
                 View Attendance
                  </Button>
                  </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
