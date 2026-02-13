import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleOAuthSuccess } = useAuth();
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent double processing in React 18 Strict Mode
        if (hasProcessed.current) return;

        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            const processOAuth = async () => {
                hasProcessed.current = true;
                try {
                    await handleOAuthSuccess(token);
                    toast.success('Successfully logged in!', {
                        toastId: 'oauth-success' // Unique ID prevents duplicates
                    });
                    navigate('/dashboard');
                } catch (error) {
                    console.error('OAuth processing error:', error);
                    toast.error('Authentication failed', {
                        toastId: 'oauth-error'
                    });
                    navigate('/login');
                }
            };
            processOAuth();
        } else {
            toast.error('No authentication token found');
            navigate('/login');
        }
    }, [location.search, handleOAuthSuccess, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB]">
            <Loader />
            <p className="mt-4 text-gray-500 font-medium font-medium">Finalizing authentication...</p>
        </div>
    );
};

export default OAuthCallback;
