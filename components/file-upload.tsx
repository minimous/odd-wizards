import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { FormControl } from './ui/form';
import { Input } from './ui/input';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  disabled?: boolean;
  defaultValue?: string | null;
  onChange: (file: File) => void;
}

export default function FileUpload({
  onChange,
  defaultValue,
  disabled
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const name = file.name;
      // Display the full name if it's 5 characters or less, otherwise format it
      const displayFileName =
        name.length > 15
          ? `${name.substring(0, 5)}...${name.slice(-10)}`
          : name;
      setFileName(displayFileName);
      onChange(file);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      let name = defaultValue.substring(defaultValue.lastIndexOf('/') + 1);
      const displayFileName =
        name.length > 15
          ? `${name.substring(0, 5)}...${name.slice(-10)}`
          : name;
      setFileName(displayFileName);
    }
  }, []);

  return (
    <div className="relative ml-auto flex items-center gap-4 rounded border border-gray-800 bg-black px-4 py-6 md:grow-0">
      <FormControl>
        {/* Attach the ref to the hidden file input */}
        <Input
          ref={hiddenFileInput}
          onChange={handleFileChange}
          id="uploadFile"
          className="hidden"
          type="file"
        />
      </FormControl>
      {/* Trigger the handleClick function when the button is clicked */}
      <Button
        disabled={disabled}
        onClick={handleClick}
        variant={'ghost'}
        className="bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 text-black hover:text-black"
        type="button"
      >
        <span>Choose File</span>
      </Button>
      <span className="text-sm text-gray-400">Csv, Text ...</span>
    </div>
  );
}
