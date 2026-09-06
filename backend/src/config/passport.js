const passport = require("passport");
const GoogleStrategy =
    require("passport-google-oauth20").Strategy;

const { upsertUser } = require("../services/user.service");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {
            try {
                if (!profile || !profile.id) {
                    throw new Error(
                        "Google profile information is unavailable."
                    );
                }

                const email =
                    Array.isArray(profile.emails) &&
                    profile.emails.length > 0
                        ? profile.emails[0].value
                        : null;

                const photoUrl =
                    Array.isArray(profile.photos) &&
                    profile.photos.length > 0
                        ? profile.photos[0].value
                        : null;

                if (!email) {
                    throw new Error(
                        "Google account email is unavailable."
                    );
                }

                const databaseUser = await upsertUser({
                    googleId: profile.id,
                    email,
                    displayName:
                        profile.displayName || null,
                    photoUrl,
                });

                const user = {
                    id: profile.id,

                    databaseId: databaseUser.id,

                    displayName:
                        databaseUser.display_name,

                    email:
                        databaseUser.email,

                    photoUrl:
                        databaseUser.photo_url,

                    role:
                        databaseUser.role,

                    dailyAnalysisLimit:
                        databaseUser.daily_analysis_limit,

                    accessToken,

                    refreshToken,
                };

                return done(null, user);

            } catch (error) {
                console.error(
                    "Google authentication error:",
                    error
                );

                return done(error, null);
            }
        }
    )
);

passport.serializeUser(
    (user, done) => {
        done(null, user);
    }
);

passport.deserializeUser(
    (user, done) => {
        done(null, user);
    }
);

module.exports = passport;