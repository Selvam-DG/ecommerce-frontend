import { Navigate} from 'react-router-dom';
import useStore from '../store/useStore';


const ProtectedRoute = ({ children, requireRole }) => {
    const { isAuthenticated, user } = useStore();

    if (!isAuthenticated){
        return <Navigate to="/login" replace />;
    }

    if (requireRole && user?.role !== requireRole && user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default ProtectedRoute;