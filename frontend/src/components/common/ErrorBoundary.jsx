import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                    <div className="bg-slate-800 p-8 rounded-lg max-w-2xl w-full border border-red-500/50 shadow-2xl">
                        <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
                        <p className="text-gray-300 mb-6">
                            The application encountered an unexpected error. Please try refreshing the page.
                        </p>

                        <div className="bg-slate-950 p-4 rounded text-sm font-mono text-red-300 overflow-auto max-h-64 mb-6">
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-violet-700 text-white font-bold py-2 px-6 rounded transition-colors"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                            className="ml-4 text-gray-400 hover:text-white underline"
                        >
                            Clear Cache & Restart
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
