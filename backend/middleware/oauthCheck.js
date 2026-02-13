/**
 * Middleware to check if OAuth providers are correctly configured
 */
export const checkOauthConfig = (provider) => {
    return (req, res, next) => {
        const configMap = {
            google: {
                id: process.env.GOOGLE_CLIENT_ID,
                secret: process.env.GOOGLE_CLIENT_SECRET
            },
            github: {
                id: process.env.GITHUB_CLIENT_ID,
                secret: process.env.GITHUB_CLIENT_SECRET
            },
            linkedin: {
                id: process.env.LINKEDIN_CLIENT_ID,
                secret: process.env.LINKEDIN_CLIENT_SECRET
            }
        };

        const config = configMap[provider];

        if (!config || !config.id || config.id.includes('REPLACE_WITH') || !config.secret || config.secret.includes('REPLACE_WITH')) {
            console.error(`❌ OAuth Error: ${provider.toUpperCase()} is not configured properly in .env`);
            return res.status(400).json({
                success: false,
                message: `OAuth for ${provider} is not configured. Please add ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET to your backend .env file.`
            });
        }

        next();
    };
};
