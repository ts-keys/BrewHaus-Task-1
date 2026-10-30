
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                message: "You must be signed in to continue.",
            });
        }

        req.userId = session.user.id;

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Authentication failed.",
        });
    }
}
