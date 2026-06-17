const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Access denied. No user authenticated.' });
  }

  if (req.user.is_admin !== true) {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }

  next();
};

module.exports = { adminOnly };
