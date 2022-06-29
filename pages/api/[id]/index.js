import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        deleteNote(req, res);
    } else if (req.method === 'PUT') {
        updateNote(req, res);
    } else {
        res.status(400).json({ message: 'Expected method is DELETE, PUT' })
    }
}

async function deleteNote(req, res) {
    const noteID = req.query.id;
    const note = await prisma.note.delete({
        where: {
            id: Number(noteID)
        }
    });
    res.json(note);
};

async function updateNote(req, res) {
    const noteID = req.query.id;
    const { title, description } = req.body;
    const note = await prisma.note.update({
        where: {
            id: Number(noteID),
        },
        data: {
            title: title,
            description: description
        }
    });
    res.json(note);
};