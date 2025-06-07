import '../styles/global.scss';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="primary-button">Go Home</Link>
    </div>
  );
}