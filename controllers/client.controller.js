import Client from "../models/Client.js";

export const createClient = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "required fileds are empty" });
    }

    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ message: "client already exist" });
    }

    const createdClient = await Client.create({ name, phone, email });
    return res
      .status(200)
      .json({ message: "client created sucessfully", data: createdClient });
  } catch (error) {
    return res.status(500).json({ error: MessageChannel.error });
  }
};

export const showClients = async (req, res) => {
  try {
    let { page = 1, limit = 10, client } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let whereClause = {};

    if (client) {
      whereClause.name = {
        [Op.like]: `%${client}%`,
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Client.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPage = Math.ceil(count / limit);
    const hasNextPage = page < totalPage;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      totalItems: count,
      totalPage,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateClients = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = req.params.id;
    const client = await Client.findOne({
      where: { id },
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.update({ name, email, phone });

    return res.status(200).json({ message: "client Updated", data: client });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteClients = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }
    const deletedRows = await Client.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    return res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
