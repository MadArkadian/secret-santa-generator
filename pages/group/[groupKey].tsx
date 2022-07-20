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
    const [showResults, setShowResults] = React.useState(false);

    if (!groupKey || typeof groupKey !== 'string') {
        return <div>Invalid Group Key</div>;
    }
    const getReceiver = trpc.useQuery(["getReceiver", { key: groupKey, giver: giverName }]);
    const checkKey = trpc.useQuery(["checkKey", { key: groupKey }]);
    const showGroup = trpc.useQuery(["showGroup", { key: groupKey }]);

    if (!checkKey.data && !checkKey.isLoading) {
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
            <span onClick={() => copyToClipboard()} className={`flex font-bold ${!copied && 'hover:cursor-pointer'} justify-center text-center mb-10 text-xs`}>
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
                <span className='flex flex-col justify-center items-center capitalize mb-3'>You&apos;re getting a gift for: {getReceiver.data.receiver}</span>
            )}
            {!showResults && (
                <div className='flex flex-col justify-center items-center mt-3'>
                    <button className="justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => { setShowResults(true) }}>Show Group Result</button>
                    <span className="flex flex-col justify-center items-center text-red-600 w-[10rem] text-center">Note: This will show you the group results (who was giver and who was receiver)</span>
                </div>
            )}
            {showResults && showGroup.data && (
                <div className='flex flex-col justify-center items-center mt-3'>
                    {showGroup.data.map((value, index) => {
                        return (
                            <div key={index} className='flex flex-col justify-center items-center mb-3'>
                                <span key={index} className='flex justify-center text-center'>Giver: {value.giver}</span>
                                <span key={index} className='flex justify-center text-center'>Receiver: {value.receiver}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default GroupKey;
