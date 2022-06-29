import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {

  const { title, description } = req.body;

  try {
    const createNote = await prisma.note.create({
      data: {
        title: title,
        description: description
      },
    });
    res.status(201).json({ note: createNote, message: 'Note created success', status: 201 });
  } catch (err) {
    console.log(err);
  }
}
