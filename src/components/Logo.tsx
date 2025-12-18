import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
        <Zap className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-foreground">BijliTrack</span>
    </Link>
  );
};

export const LogoWhite = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
        <Zap className="w-6 h-6 text-primary" />
      </div>
      <span className="text-xl font-bold text-white">BijliTrack</span>
    </Link>
  );
};
