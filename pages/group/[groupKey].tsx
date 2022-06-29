import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from '../../utils/trpc';

type Form = {
    key: string;
    giver: string;
    receiver: string;
};

const GroupKey: NextPage = () => {
    const router = useRouter();
    const { groupKey } = router.query;
    const [giverName, setGiverName] = React.useState('');
    const [receiverName, setReceiverName] = React.useState('');
    const [findName, setFindName] = React.useState(false);

    if (!groupKey || typeof groupKey !== 'string') {
        return <div>Invalid Group Key</div>;
    }
    const getReceiver = trpc.useQuery(["getReceiver", { key: groupKey, giver: giverName }]);



    // const retrieveName = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const getReceiver = trpc.useQuery(["getReceiver", { key: groupKey, giver: giverName }]);
    //     if (getReceiver.data && !getReceiver.isLoading) {
    //         setReceiverName(getReceiver.data.receiver);
    //     }
    // }

    return (
        <div className='flex flex-col'>
            <h1 className='flex text-3xl justify-center text-center mb-10 mt-5'>Welcome to your Group!</h1>
            <form className='flex flex-col justify-center items-center'>
                <label className='flex justify-center mb-5'>Enter Your Name Here</label>
                <input className='flex mb-2' type="text" placeholder="Name..." value={giverName} onChange={e => { setGiverName(e.target.value); setFindName(false) }} />
                <button onClick={() => { setFindName(true) }} type='button' className='inline-flex justify-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Get Receiver
                </button>
            </form>
            {getReceiver.data && findName && (
                <span className='flex flex-col justify-center items-center'>{getReceiver.data.receiver}</span>
            )}
        </div>
    );
}

export default GroupKey;

