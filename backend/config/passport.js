import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';

const configurePassport = () => {
    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    user.googleId = profile.id;
                    user.provider = 'google';
                    await user.save();
                } else {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        provider: 'google',
                        profile: {
                            avatar: profile.photos[0]?.value || ''
                        },
                        isVerified: true
                    });
                }
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    // GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID || 'placeholder',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
        callbackURL: "/api/auth/github/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
                const email = profile.emails && profile.emails[0]?.value;
                if (email) {
                    user = await User.findOne({ email });
                }

                if (user) {
                    user.githubId = profile.id;
                    user.provider = 'github';
                    await user.save();
                } else {
                    user = await User.create({
                        name: profile.displayName || profile.username,
                        email: email || `${profile.username}@github.com`,
                        githubId: profile.id,
                        provider: 'github',
                        profile: {
                            avatar: profile.photos[0]?.value || ''
                        },
                        isVerified: true
                    });
                }
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    // LinkedIn Strategy
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID || 'placeholder',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'placeholder',
        callbackURL: "/api/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ linkedinId: profile.id });
            if (!user) {
                user = await User.findOne({ email: profile.emails[0].value });
                if (user) {
                    user.linkedinId = profile.id;
                    user.provider = 'linkedin';
                    await user.save();
                } else {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        linkedinId: profile.id,
                        provider: 'linkedin',
                        profile: {
                            avatar: profile.photos[0]?.value || ''
                        },
                        isVerified: true
                    });
                }
            }
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

export default configurePassport;
