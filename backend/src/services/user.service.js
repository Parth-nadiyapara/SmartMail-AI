const supabase = require("../config/supabase");

const upsertUser = async ({
    googleId,
    email,
    displayName,
    photoUrl,
}) => {

    const { data, error } = await supabase
        .from("users")
        .upsert(
            {
                google_id: googleId,
                email,
                display_name: displayName || null,
                photo_url: photoUrl || null,
            },
            {
                onConflict: "google_id",
            }
        )
        .select()
        .single();

    if (error) {
        console.error(
            "Supabase user upsert error:",
            error
        );

        throw new Error(
            "Failed to save user."
        );
    }

    return data;
};

module.exports = {
    upsertUser,
};