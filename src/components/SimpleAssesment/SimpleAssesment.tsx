import React, { type MouseEvent } from 'react';

const SimpleAssessmentComponent = ({ onClose, onConfirm }: {
  onClose: (e: MouseEvent) => void;
  onConfirm: (e: MouseEvent) => void;
}) => {
  return (
    <div className="bg-white p-6 max-w-4xl mx-auto my-8 w-[48rem]">
      <form className="mt-4 gap-12">
        <div className="mb-12">
          <label className="block text-md font-medium text-gray-700">What really is a smart contract?</label>
          <select
            className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="answer1">A digital contract</option>
            <option value="answer2">A physical contract</option>
            <option value="answer3">A self-executing contract</option>
            <option value="answer4">None of the above</option>
          </select>
        </div>
        <div className="mb-12">
          <label className="block text-md font-medium text-gray-700"></label>
          What is the primary purpose of blockchain technology?
          <select
            className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="answer1">To secure digital transactions</option>
            <option value="answer2">To create a centralized database</option>
            <option value="answer3">To facilitate online payments</option>
            <option value="answer4">To provide a decentralized ledger</option>
          </select>
        </div>
        <div className="mb-12">
          <label className="block text-md font-medium text-gray-700">Which of the following is a feature of Ethereum?</label>
          <select
            className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option value="answer1">Proof of Stake</option>
            <option value="answer2">Smart Contracts</option>
            <option value="answer3">Centralized Control</option>
            <option value="answer4">None of the above</option>
          </select>
        </div>
        <div className="flex justify-between mt-32">
          <button type="button" onClick={onClose} className="inline-block rounded-lg px-6 py-2 text-center hover:no-underline my-0 bg-gray-200 text-white hover:bg-gray-300 mr-0 disabled:bg-gray-200 disabled:text-black text-sm disabled:cursor-not-allowed">Cancel</button>
          <button type="submit" onClick={onConfirm} className="inline-block rounded-lg px-6 py-2 text-center hover:no-underline my-0 bg-[#0FB587] text-white hover:bg-[#1FB599] mr-0 disabled:bg-gray-200 disabled:text-black text-sm disabled:cursor-not-allowed">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SimpleAssessmentComponent;
