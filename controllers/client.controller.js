import Client from "../models/Client.js";

export const createClient = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "required fileds are empty" });
    }

    const existingClient = await Client.findOne({ email });
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
