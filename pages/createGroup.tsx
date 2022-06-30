import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../utils/trpc';

const CreateGroup: NextPage = () => {
    const addPerson = trpc.useMutation(["addPerson"]);

    const [amountOfPeople, setAmountOfPeople] = React.useState(0);
    const [amount, setAmount] = React.useState(2);

    const [error, setError] = React.useState('');
    let router = useRouter();

    const validateNumber = (value: number) => {
        if (value <= 1) {
            setError('Amount of people must be greater than 1');
            return;
        }
        setAmountOfPeople(value);
    }

    const generateGroup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const childNodes = e.currentTarget.childNodes as NodeListOf<HTMLInputElement>;
        let names: any[] = [];
        let people: string[] = [];
        for (let i = 1; i < childNodes.length - 1; i++) {
            names.push([i - 1, childNodes[i].value]);
            people.push(childNodes[i].value);
        }
        const people_dict = generateList(names as [], people);
        //console.log(people_dict);
        // generate 10 character random string
        const group_key = generateGroupKey(10);
        //console.log(group_key);
        people_dict.forEach((value, key) => {
            addPerson.mutate({
                key: group_key,
                giver: key.toLowerCase(),
                receiver: value.toLowerCase(),
            });
        });

        router.push(`/group/${group_key}`);
    }

    const generateList = (names: [], people: string[]) => {
        let people_dict = new Map<string, string>();
        // randomize names
        for (let i = 0; i < names.length; i++) {
            if (names[i][0] === i) {
                let ranNum = i;
                while (ranNum === i) {
                    ranNum = Math.floor(Math.random() * names.length);
                }
                let temp = names[i];
                names[i] = names[ranNum];
                names[ranNum] = temp;
            }
        }
        for (let i = 0; i < names.length; i++) {
            people_dict.set(people[i], names[i][1]);
        }
        return people_dict;
    }
    const generateGroupKey = (length: number): string => {
        let outString: string = '';
        let inOptions: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        }

        return outString;
    }

    if (amountOfPeople === 0) {
        return (
            <div className='flex flex-col'>
                <h1 className='flex text-3xl justify-center text-center mb-10 mt-5'>Create Group</h1>
                <form className='flex flex-col justify-center items-center'>
                    <label className='flex text-2xl justify-center text-center mb-10'>Amount of people</label>
                    <span className='flex flex-col justify-center items-center text-red-500 text-xl'>{error}</span>
                    <input type='number' defaultValue={2} id="amount" name="amount" className='flex p-2 mb-2' onChange={e => { setAmount(parseInt(e.target.value)) }} />
                    <button type='button' onClick={() => { validateNumber(amount) }} className='inline-flex justify-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        Set Amount of People
                    </button>
                </form>
            </div >
        )
    }

    let people = [];
    for (let i = 0; i < amountOfPeople; i++) {
        people.push(<input className='flex mb-2' key={i} type="text" placeholder="Name..." />);
    }

    return (
        <div className='flex flex-col'>
            <h1 className='flex text-3xl justify-center text-center mb-10 mt-5'>Create Group</h1>
            <form className='flex flex-col justify-center items-center' onSubmit={(e) => { generateGroup(e) }}>
                <label className='flex justify-center mb-5'>Enter Everyone&apos;s Name</label>
                {people}
                <button type='submit' className='inline-flex justify-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-blue-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Generate Group
                </button>
            </form>
        </div>
    )
}
export default CreateGroup;