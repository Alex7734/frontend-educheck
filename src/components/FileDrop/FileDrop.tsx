import React from 'react';

const FileDrop = ({ onFileSubmit }: { onFileSubmit: () => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    onFileSubmit();
  };

  return (
    <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-lg bg-white hover:bg-gray-100 cursor-pointer'>
      <input
        type='file'
        className='w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100'
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default file input
      />
      <label
        htmlFor='file_input'
        className='flex flex-col items-center justify-center space-y-2 cursor-pointer'
      >
        <p className='text-gray-700 text-lg'>
          Drag &apos;n&apos; drop your CV here, or click to select files
        </p>
        <button
          id='file_input'
          onClick={() => document?.getElementById('hidden-file-input')?.click()}
          className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300'
        >
          Upload File
        </button>
        <input
          id='hidden-file-input'
          type='file'
          onChange={handleFileChange}
          accept='.txt'
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

export default FileDrop;
