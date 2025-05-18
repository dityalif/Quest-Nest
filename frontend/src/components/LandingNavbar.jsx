import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white text-2xl font-bold">
              Quest<span className="text-accent">Nest</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
