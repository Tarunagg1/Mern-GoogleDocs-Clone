import documentModel from "../models/documentSchema.js";

export const getDocument = async (id) => {
  if (!id) return;

  try {
    const document = await documentModel.findOne({ docId: id });
    if (document) return document;

    return await documentModel.create({
      docId: id,
      docName: `NAME${id}`,
      content: "",
    });
  } catch (error) {
    throw new Error(`Server error`);
  }
};

export const updateDocument = async (id, data) => {
  if (!id) return;

  try {
    return await documentModel.findOneAndUpdate(
      { docId: id },
      { content: data },
      { new: true }
    );
  } catch (error) {
      console.log(error);
    throw new Error(`Server error`);
  }
};
