'use client';

import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { Participant } from '@/types/raflles';
import { formatAddress } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface SetupBotProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export default function SetupBotModal({
    isOpen,
    onClose,
    loading
}: SetupBotProps ) {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black px-2">
                <div className="w-full bg-black text-white">
                    <div className='px-6 pb-2'>
                        <span className='font-bold text-xl'>Setup Your Bot</span>
                    </div>
                    <ScrollArea className='h-[80vh]'>
                        <div className='grid gap-y-2 mt-2 px-6 pb-4'>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
