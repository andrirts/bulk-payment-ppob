class AuthMiddleware {
    static auth(req, res, next) {
        const { username, partner_id, pin, password } = req.body;

        if (!username || !partner_id || !pin || !password) {
            return res.status(400).json({
                error: true,
                information: "Missing required fields"
            });
        }

        const findUserByUsername = UserService.findByUsername(username);

        if (!findUserByUsername) {
            return res.status(400).json({
                error: true,
                information: "User not found"
            });
        }

    }
}

module.exports = AuthMiddleware;