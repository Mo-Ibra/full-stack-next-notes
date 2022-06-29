import { useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { prisma } from '../lib/prisma';

function Home({ notes }) {

  const [form, setForm] = useState({ title: '', description: '' });
  const router = useRouter();

  const successMsg = (message) => {
    console.log(message);
  }

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const createNote = function (data) {
    try {
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }).then(() => {
        setForm({ title: '', description: '' });
        refreshData();
        successMsg('Note has been created');
      })
    } catch (err) {
      console.log(err);
    }
  }

  const deleteNote = async (id) => {
    try {
      fetch(`http://localhost:3000/api/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'DELETE'
      }).then(() => {
        refreshData();
        successMsg('Note has been deleted');
      });
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (data) => {
    try {
      createNote(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes</h1>
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
        <button type="submit" className="bg-blue-500 text-white rounded p-1">Add +</button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {notes.map(note => (
            <li key={note.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="text-sm">{note.description}</p>
                  <Link
                    href={{
                      pathname: '/edit/[id]',
                      query: { id: note.id }
                    }}
                  >
                    <button className="bg-blue-500 mr-3 px-3 text-white rounded">Update</button>
                  </Link>
                  <button onClick={() => deleteNote(note.id)} className="bg-red-500 px-3 text-white rounded">X</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home;

export const getServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      description: true
    }
  });
  return {
    props: {
      notes: notes,
    }
  }
}