// Helper function for API calls with retry logic
const retryWithBackoff = async (apiCall, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            if (error.response?.status === 429 && attempt < maxRetries) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, attempt - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                console.log(`Retrying after ${delay}ms (attempt ${attempt}/${maxRetries})`);
                continue;
            }
            throw error; // Re-throw if not retryable or max retries reached
        }
    }
};

// Wrap existing methods with retry logic
const adminService = {
    // Get dashboard stats
    getDashboardStats: async () => {
        return retryWithBackoff(async () => {
            const response = await api.get('/admin/stats');
            return response.data;
        });
    },