import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { MouseEvent, useState } from 'react';

const Home: NextPage = () => {
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const checkGroup = async () => {
        const group = await fetch(`/api/group/${key}`);
        if (group.status === 400) {
            setError('Group does not exist');
            return
        }
        router.push(`/group/${key}`);
    }
    return (
        <div>
            <h1 className="flex text-3xl font-bold justify-center pt-5 pb-10">Secret Santa Generator!</h1>
            <div className='flex flex-col items-center h-screen'>
                <button onClick={() => { router.push(`/createGroup`) }} type="button" className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Create Group
                </button>
                <span className='pt-6 p-2 font-bold'>Enter Group Key Here</span>
                <span className='flex flex-col justify-center items-center text-red-500 text-xl'>{error}</span>
                <input type="text" placeholder='Group-Key' className='mb-3' onChange={e => { setKey(e.target.value) }} value={key} />
                <button onClick={() => { checkGroup() }} type="button" className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Join Group
                </button>
            </div>
        </div>
    )
}

export default Home
