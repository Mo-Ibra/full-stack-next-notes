import { useRouter } from "next/router";
import { useState } from "react";
import { prisma } from "../../lib/prisma";

const Edit = function ({ note }) {

    const [form, setForm] = useState({ title: note.title, description: note.description });

    const router = useRouter();
    const { id } = router.query;

    const successMsg = function(message) {
        console.log(message);
    }

    const updateNote = (data) => {
        try {
            fetch(`http://localhost:3000/api/${id}`, {
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'PUT'
            }).then(() => {
                successMsg('Note has been updated');
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (data) => {
        try {
            updateNote(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1 className="text-center font-bold text-2xl mt-4">Edit Note: {form.title}</h1>
            <form onSubmit={e => {
                e.preventDefault()
                handleSubmit(form)
            }} className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'>
                <input type="text"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="border-2 rounded border-gray-600 p-1"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-1">Update</button>
            </form>
        </div>
    )
};

export default Edit;

export const getServerSideProps = async (context) => {

    const { id } = context.query;

    const note = await prisma.note.findUnique({
        where: {
            id: Number(id),
        },
        select: {
            id: true,
            title: true,
            description: true
        }
    });

    return {
        props: {
            note
        }
    }

};