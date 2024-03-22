export default class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAll = () => {
      return this.dao.getAll();
    };
  
    save = (ticket) => {
      return this.dao.save(ticket);
    };
  
    update = (id, ticket) => {
      return this.dao.update(id, ticket);
    };
  
    findById = async (id) => {
      return this.dao.findById(id);
    };
  
    delete = async (id) => {
      return this.dao.delete(id);
    };
  }
  