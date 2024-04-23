export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = () => {
    return this.dao.getAll();
  };

  save = (user) => {
    return this.dao.save(user);
  };

  update = (id, user) => {
    return this.dao.update(id, user);
  };

  findById = async (id) => {
    return this.dao.findById(id);
  };

  delete = async (id) => {
    return this.dao.delete(id);
  };

  loginUser = async (email, password) => {
    return this.dao.loginUser(email, password);
  };

  deleteInactiveUsers = async (cutoffDate) => {
    return this.dao.deleteInactiveUsers(cutoffDate);
  };

  getInactiveUsersEmails = async (cutoffDate) => {
    return this.dao.getInactiveUsersEmails(cutoffDate);
  };

  findByEmail = async (email) => {
    return this.dao.findByEmail(email);
  };
}
