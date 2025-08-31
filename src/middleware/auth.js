const isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).send({ message: "Unauthorized!" });
    } catch (error) {
        return res.status(500).send({ message: error?.message || "INTERNAL SERVER ERROR" });
    }
}

module.exports = {
    isAuthenticated,
};