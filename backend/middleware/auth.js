const authenticateResident = (req, res, next) => {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'NewMember') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

const authenticateAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'SocitySetUp') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

module.exports = {
  authenticateResident,
  authenticateAdmin,
};
