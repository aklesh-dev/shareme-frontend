import React from 'react';
import { DNA } from 'react-loader-spinner';

const Spinner = ({message}) => {
    return (
        <section className="flex flex-col justify-center items-center w-full h-full">
            <DNA
                visible={true}
                height={80}
                width={80}
                ariaLabel='dna-loading'
                wrapperClass='dna-wrapper'
            />
            <p className="text-lg text-center p-2">{message}</p>
        </section>
    )
}

export default Spinner;