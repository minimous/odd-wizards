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

interface ParticipantsProps {
    participants: Participant[]
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export default function ParticipantsModal({
    participants,
    isOpen,
    onClose,
    loading
}: ParticipantsProps) {

    const summedParticipants = participants.reduce((acc, participant) => {
        const address = participant.participant_address || 'Unknown';
        const amount = participant.participant_amount || 0;
      
        if (!acc[address]) {
          acc[address] = { participant_address: address, total_amount: 0 };
        }
        acc[address].total_amount += amount;
      
        return acc;
      }, {} as Record<string, { participant_address: string; total_amount: number }>);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black px-2">
                {/* <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader> */}
                <div className="w-full bg-black text-white">
                    <div className='px-6 pb-2'>
                        <span className='font-bold text-xl'>Raffle Participant</span>
                    </div>
                    <ScrollArea className='h-[80vh]'>
                        <div className='grid gap-y-2 mt-2 px-6 pb-4'>
                            {
                                Object.values(summedParticipants).map((item, index) => {
                                    return (<div key={index} className='flex justify-between text-xl'>
                                        <Link href={`https://www.stargaze.zone/p/${item.participant_address}/tokens`} >
                                            <span className='font-bold'>{formatAddress(item.participant_address ?? undefined)}</span>
                                        </Link>
                                        <span>{item.total_amount}</span>
                                    </div>)
                                })
                            }
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
