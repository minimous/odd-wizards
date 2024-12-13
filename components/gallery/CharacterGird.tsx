import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CharacterGrid = () => {
  const characterData = [
    { imageUrl: "/images/Prize/BytePets 12th.jpg", name: "Image 1" },
    { imageUrl: "/images/Prize/Celothiraptop 5th.jpg", name: "Image 2" },
    { imageUrl: "/images/Prize/Digitz 4th.jpg", name: "Image 3" },
    { imageUrl: "/images/Prize/Drama Queens 2nd.jpg", name: "Image 4" },
    { imageUrl: "/images/Prize/Elysian Horde 3rd.jpg", name: "Image 5" },
    { imageUrl: "/images/Prize/Expedition 1st.jpg", name: "Image 6" },
    { imageUrl: "/images/Prize/Pixel Plebs 8th.jpg", name: "Image 7" },
    { imageUrl: "/images/Prize/RarityBotz 7th.jpg", name: "Image 8" },
    { imageUrl: "/images/Prize/Rebbits 6th.jpg", name: "Image 9" },
    { imageUrl: "/images/Prize/Stamp 11th.jpg", name: "Image 10" },
    { imageUrl: "/images/Prize/Steamland 10th.jpg", name: "Image 11" },
    { imageUrl: "/images/Prize/The Watchers 9th.jpg", name: "Image 12" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {characterData.map((character, index) => (
        <Card key={index} className={`w-full h-auto ${getRandomSize()}`}>
          <CardHeader>
            <CardTitle>{character.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-full h-auto object-contain"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function to get a random size class
const getRandomSize = () => {
  const sizes = ['h-64', 'h-80', 'h-96'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

export default CharacterGrid;