import Footer from "./components/Footer";
import FeaturesSection from "./components/FeatureSection";
import { Button } from "@repo/ui/Button";
import Logo from "./components/Logo";
import { DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/Dialog";
import { Input } from "@repo/ui/Input";
import { Card, CardContent, CardFooter } from "@repo/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <Logo />
          {/* <div className="flex gap-4">
            <UserMenu />
          </div> */}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 container">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Collaborate in real-time on a shared canvas
              </h1>
              <p className="text-xl text-muted-foreground">
                Create, sketch, and design together with your team. 
                Share ideas visually no matter where you are.
              </p>
              <div className="flex gap-4">
                <Button size="lg">
                  Start Drawing Now
                </Button>
                <dialog>
                  <DialogTrigger>
                    <Button size="lg" variant="outline">
                      Join Existing Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join an existing room</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input 
                        placeholder="Enter room ID" 
                        //value={joinRoomId} 
                        //onChange={}
                      />
                      <Button className="w-full">
                        Join
                      </Button>
                    </div>
                  </DialogContent>
                </dialog>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full aspect-video bg-secondary rounded-lg overflow-hidden room-gradient">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-opacity-80 text-center px-8">
                    <p className="text-xl font-medium animate-pulse-slow">Live Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeaturesSection />

        <section className="py-20 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Join a Room or Create Your Own
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="room-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Create a Room</h3>
                  <p className="text-muted-foreground">
                    Start a new collaborative canvas and invite your team to join
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="default" size="lg" className="w-full">
                    Create Room
                  </Button>
                </CardFooter>
              </Card>
              <Card className="room-card">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Join a Room</h3>
                  <p className="text-muted-foreground">
                    Enter a room ID to join an existing collaborative session
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Input 
                    placeholder="Room ID" 
                    // value={joinRoomId} 
                    // onChange={(e) => setJoinRoomId(e.target.value)}
                  />
                  <Button className="w-full">
                    Join Room
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
