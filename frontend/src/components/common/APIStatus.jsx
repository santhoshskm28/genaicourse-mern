import React, { useState, useEffect } from 'react';

/**
 * API Connection Status Component
 * Displays the connection status between frontend and backend
 */
const APIStatus = () => {
    const [status, setStatus] = useState({
        backend: 'checking',
        database: 'checking',
        message: 'Checking connection...'
    });

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            // Health endpoint is at root level, not under /api
            const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const response = await fetch(`${baseURL}/health`);
            const data = await response.json();

            if (data.success) {
                setStatus({
                    backend: 'connected',
                    database: data.database === 'Connected' ? 'connected' : 'disconnected',
                    message: data.message,
                    timestamp: data.timestamp,
                    environment: data.environment
                });
            }
        } catch (error) {
            setStatus({
                backend: 'error',
                database: 'unknown',
                message: error.message || 'Failed to connect to backend'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected':
                return 'text-green-400';
            case 'disconnected':
            case 'error':
                return 'text-red-400';
            default:
                return 'text-yellow-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected':
                return '✓';
            case 'disconnected':
            case 'error':
                return '✗';
            default:
                return '⟳';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg z-50 min-w-[300px]">
            <h3 className="text-sm font-semibold text-white mb-2">API Connection Status</h3>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Backend:</span>
                    <span className={`font-semibold ${getStatusColor(status.backend)}`}>
                        {getStatusIcon(status.backend)} {status.backend}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400">Database:</span>
                    <span className={`font-semibold ${getStatusColor(status.database)}`}>
                        {getStatusIcon(status.database)} {status.database}
                    </span>
                </div>
                {status.environment && (
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Environment:</span>
                        <span className="text-white font-semibold">{status.environment}</span>
                    </div>
                )}
                <div className="pt-2 border-t border-slate-700">
                    <p className="text-slate-300 text-xs">{status.message}</p>
                </div>
                <button
                    onClick={checkConnection}
                    className="w-full mt-2 px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded text-xs transition-colors"
                >
                    Refresh Status
                </button>
            </div>
        </div>
    );
};

export default APIStatus;
