import { ticketModel } from "./models/ticket.js";

export default class TicketServiceMongo {
  constructor() {}

  getAll = async (options) => {
    try {
      const { limit = 10, page = 1 } = options || {};

      const result = await ticketModel
        .find({})
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const totalItems = await ticketModel.countDocuments({});

      return {
        items: result,
        totalItems,
      };
    } catch (error) {
      throw error;
    }
  };

  save = async (ticket) => {
    try {
      const result = await ticketModel.create(ticket);
      return result;
    } catch (error) {
      throw error;
    }
  };

  findById = async (id) => {
    try {
      const result = await ticketModel.findById(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  update = async (filter, updates) => {
    try {
      const result = await ticketModel.updateOne(filter, updates);
      return result;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const result = await ticketModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      throw error;
    }
  };
}
