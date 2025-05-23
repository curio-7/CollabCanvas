import { Pencil, Users, Clock, Share2 } from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Intuitive Drawing Tools",
    description: "Access a variety of drawing tools including pen, shapes, and text with customizable colors and styles.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together simultaneously with multiple users seeing changes instantly as they happen.",
  },
  {
    icon: Clock,
    title: "Persistent Rooms",
    description: "Your canvas persists between sessions so you can continue where you left off.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your room with a simple link that allows others to join your canvas instantly.",
  },
];

export default function FeaturesSection(){
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features to Enhance Collaboration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features?.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-canvas-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
