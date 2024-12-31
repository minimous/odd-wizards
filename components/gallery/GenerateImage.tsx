"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { METADATA_TRAITS, MetadataTraits } from "@/constants/metadata";
import Image from "next/image";
import { Dices, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select";

interface Traits {
    [key: string]: string;
}

interface GenerateImageProps {
    collection: string
}

export default function GenerateImage({ collection }: GenerateImageProps) {
    const traits: string[] = Object.keys(METADATA_TRAITS[collection]);
    const [activeTraits, setActiveTraits] = useState<string>(traits[0]);
    const [listTraits, setListTraits] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const [selectedTraits, setSelectedTraits] = useState<Traits>({
        [traits[0]]: METADATA_TRAITS[collection][traits[0]][0],
        ...Object.fromEntries(traits.slice(1).map(trait => [trait, ""]))
    });

    useEffect(() => {
        localStorage.clear();
    }, [])

    useEffect(() => {
        
        setActiveTraits(traits[0]);

        // Reset selected traits to default state with first trait selected and others empty
        setSelectedTraits({
            [traits[0]]: METADATA_TRAITS[collection][traits[0]][0],
            ...Object.fromEntries(traits.slice(1).map(trait => [trait, ""]))
        });

    }, [collection])

    useEffect(() => {
        if (activeTraits) {
            const defaultTraits = (METADATA_TRAITS as Record<string, MetadataTraits>)[collection][activeTraits] || [];
            setListTraits([...defaultTraits]);
        }
    }, [activeTraits]);

    const handleSelectTrait = (item: string): void => {
        setSelectedTraits(prev => ({
            ...prev,
            [activeTraits]: prev[activeTraits] === item ?
                (activeTraits == "Backdrop" ? item : "") : item
        }));
    };

    const handleRandomTraits = (): void => {
        const randomTraits: Partial<Traits> = {};
        traits.forEach(trait => {
            const traitList = (METADATA_TRAITS as Record<string, MetadataTraits>)[collection][trait] || [];
            const randomIndex = Math.floor(Math.random() * traitList.length);
            randomTraits[trait] = traitList[randomIndex];
        });
        setSelectedTraits(randomTraits as Traits);
    };


    const handleCopy = async (): Promise<void> => {
        const traitPaths = Object.entries(selectedTraits)
            .filter(([_, value]) => value)
            .map(([key, value]) => {
                if (value.startsWith('custom-')) {
                    return localStorage.getItem(value) || '';
                }
                return `/${collection}/${key}/${value}`;
            });

        // Load all images
        const images = await Promise.all(
            traitPaths.map(async (path) => {
                const img = document.createElement('img') as HTMLImageElement;
                img.src = path;
                await new Promise((resolve) => (img.onload = resolve));
                return img;
            })
        );

        // Create canvas and set its dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas size based on the first image
        canvas.width = images[0].width;
        canvas.height = images[0].height;

        // Draw each image on the canvas
        images.forEach((img) => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        });

        // Convert canvas to blob
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((b) => resolve(b), 'image/png')
        );

        if (!blob) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to create image blob'
            });
            return;
        }

        // Write the blob to clipboard as an image
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);

            toast({
                title: 'Success',
                variant: 'default',
                description: 'Image has been copied to clipboard'
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to copy image to clipboard'
            });
        }
    };



    const handleDownload = async (): Promise<void> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }

        canvas.width = 1000;
        canvas.height = 1000;

        for (const trait of traits) {
            if (selectedTraits[trait]) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        const img = document.createElement('img') as HTMLImageElement;

                        img.onload = () => {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            resolve();
                        };

                        img.onerror = () => reject(new Error(`Failed to load image for trait ${trait}`));

                        // Check if it's a custom uploaded image
                        if (selectedTraits[trait].startsWith('custom-')) {
                            const dataUrl = localStorage.getItem(selectedTraits[trait]);
                            img.src = dataUrl || '';
                        } else {
                            img.src = `/${collection}/${trait}/${selectedTraits[trait]}`;
                        }
                    });
                } catch (error) {
                    console.error(`Error loading image for trait ${trait}:`, error);
                }
            }
        }

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Could not create blob from canvas');
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rabbits.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');

        toast({
            title: 'Success',
            variant: 'default',
            description: 'Image has been downloaded.'
        });
    };

    return (
        <div className="h-full md:!mt-4">
            <div className='md:max-w-screen-xl py-0 px-6 md:!py-6 md:px-16 mx-auto'>
                <div className="grid md:flex mt-10 gap-x-8 gap-y-4">
                    <div className="w-full order-last md:order-first">
                        <Card className="w-full bg-[#18181B]">
                            <CardContent>
                                <div className="hidden mt-4 md:flex md:items-center md:justify-center gap-x-6 gap-y-4">
                                    {traits.map(item => (
                                        <div
                                            key={item}
                                            onClick={() => setActiveTraits(item)}
                                            className={cn(
                                                "cursor-pointer text-black text-xs",
                                                activeTraits === item ? "font-bold" : "",
                                                selectedTraits[item] ? "text-blue-600" : "text-[#A1A1AA]"
                                            )}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="sm:flex mt-4 md:hidden">
                                    <Select onValueChange={(val: string) => setActiveTraits(val)} defaultValue={traits[0]}>
                                        <SelectTrigger className={cn("bg-[#18181B]", selectedTraits[activeTraits] ? "text-blue-600" : "text-[#A1A1AA]")}>
                                            <SelectValue
                                                placeholder="Select Traits"
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#18181B]">
                                            {traits.map(item => (
                                                <SelectItem className={selectedTraits[item] ? "text-blue-600" : "text-[#A1A1AA]"} key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <ScrollArea className="h-[415px] w-full rounded-md border p-4 mt-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                        {listTraits.map((item, index) => (
                                            <div
                                                key={`${activeTraits}-${item}-${index}`}
                                                onClick={() => handleSelectTrait(item)}
                                                className={cn(
                                                    "relative aspect-square rounded-lg overflow-hidden border transition-colors cursor-pointer",
                                                    selectedTraits[activeTraits] === item
                                                        ? "border-blue-500 border-2"
                                                        : "hover:border-[#323237]"
                                                )}
                                            >
                                                {item.startsWith('custom-') ? (
                                                    <img
                                                        src={localStorage.getItem(item) || ''}
                                                        alt={`Custom ${activeTraits}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={`/${collection}/${activeTraits}/${item}`}
                                                        alt={`Trait ${item}`}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform duration-200"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        <div className="hidden md:!flex items-center gap-x-2 mt-4">
                            <Button
                                variant={"ghost"}
                                className="px-8 py-3 h-max font-black border border-[#323237] text-[#A1A1AA] rounded-xl bg-[#18181B] hover:bg-[#18181B] hover:text-[#A1A1AA]"
                                onClick={handleRandomTraits}
                            >
                                <Dices className="mx-1" size={20} /> Random
                            </Button>
                            <Button
                                variant={"ghost"}
                                className="px-8 py-3 h-max font-black border border-[#323237] text-[#A1A1AA] rounded-xl bg-[#18181B] hover:bg-[#18181B] hover:text-[#A1A1AA]"
                                onClick={handleCopy}
                            >
                                Copy
                            </Button>
                            <Button
                                variant={"ghost"}
                                className="flex-1 px-8 py-3 h-max font-black border border-[#323237] text-[#A1A1AA] rounded-xl bg-[#18181B] hover:bg-[#18181B] hover:text-[#A1A1AA]"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="relative aspect-square">
                            {traits.map((trait) => {
                                if (!selectedTraits[trait]) return null;
                                const src = selectedTraits[trait].startsWith('custom-')
                                    ? localStorage.getItem(selectedTraits[trait]) || ''
                                    : `/${collection}/${trait}/${selectedTraits[trait]}`;
                                return (
                                    <img
                                        key={trait}
                                        src={src}
                                        className="absolute top-0 left-0 w-full h-full object-contain rounded-xl"
                                        style={{ zIndex: traits.indexOf(trait) }}
                                        alt={trait}
                                    />
                                );
                            })}
                        </div>
                        <div className="md:hidden sm:flex">
                            <div className="flex items-center gap-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    className="px-8 py-3 h-max font-black border border-[#323237] text-[#A1A1AA] rounded-xl bg-[#18181B] hover:bg-[#18181B] hover:text-[#A1A1AA]"
                                    onClick={handleRandomTraits}
                                >
                                    <Dices className="mx-1" size={20} /> Random
                                </Button>
                                <Button
                                    variant="default"
                                    className="flex-1 px-8 py-3 h-max font-black border border-[#323237] text-[#A1A1AA] rounded-xl bg-[#18181B] hover:bg-[#18181B] hover:text-[#A1A1AA]"
                                    onClick={handleDownload}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}