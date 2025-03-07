
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="feature-card group transition-all duration-500 ease-in-out">
      <div className="mb-4 relative">
        <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
          <Icon 
            size={24} 
            className="text-primary-500 group-hover:text-white transition-colors duration-300" 
          />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-600 text-balance">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
