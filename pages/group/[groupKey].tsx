import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from '../../utils/trpc';
import Head from "next/head";

type Form = {
    key: string;
    giver: string;
    receiver: string;
};

const GroupKey: NextPage = () => {
    const router = useRouter();
    const { groupKey } = router.query;
    const [giverName, setGiverName] = React.useState('');
    const [findName, setFindName] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    if (!groupKey || typeof groupKey !== 'string') {
        return <div>Invalid Group Key</div>;
    }
    const getReceiver = trpc.useQuery(["getReceiver", { key: groupKey, giver: giverName }]);
    const checkKey = trpc.useQuery(["checkKey", { key: groupKey }]);
    if (checkKey.isLoading || getReceiver.isLoading) {
        return <div>Loading...</div>;
    }
    if (!checkKey.data) {
        return (
            <div className='flex flex-col'>
                <Head>
                    <title>Group: {groupKey}</title>
                </Head>
                <h1 className='flex text-3xl justify-center text-center mt-5'>Invalid Group Key: {groupKey}</h1>
            </div>
        );
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://www.secretsantacreator.com/group/${groupKey}`);
        setCopied(true);
    }

    return (
        <div className='flex flex-col'>
            <Head>
                <title>Group: {groupKey}</title>
            </Head>
            <h1 className='flex text-3xl justify-center text-center mb-10 mt-5'>Welcome to your Group!</h1>
            <span onClick={() => copyToClipboard()} className={`flex font-bold ${!copied && 'hover:cursor-pointer'} justify-center text-center mb-10`}>
                https://www.secretsantacreator.com/group/{groupKey}
                {copied && (<span className="flex text-gray-400 justify-center text-center">&nbsp;Copied</span>)}
            </span>
            <form className='flex flex-col justify-center items-center'>
                <label className='flex justify-center mb-5'>Enter Your Name Here</label>
                <input className='flex mb-2' type="text" placeholder="Name..." value={giverName} onChange={e => { setGiverName(e.target.value); setFindName(false) }} />
                {!findName && <button onClick={() => { setFindName(true) }} type='button' id="getReceiver" className='inline-flex justify-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Get Receiver
                </button>}
            </form>
            {getReceiver.data && findName && (
                <span className='flex flex-col justify-center items-center capitalize'>You&apos;re getting a gift for: {getReceiver.data.receiver}</span>
            )}
        </div>
    );
}

export default GroupKey;

// <span className='flex justify-center text-center'>{groupKey}</span>
