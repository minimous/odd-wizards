'use client';
import { mst_project } from '@prisma/client';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { ScrollArea } from '../scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import axios, { AxiosResponse } from 'axios';
import { useChain } from '@cosmos-kit/react';
import { useToast } from '../ui/use-toast';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

export interface ChallengeCardProps {
  project: mst_project & {
    rewards?: any[];
  };
  isAdmin?: boolean;
}

const ChallengeCard = ({ project, isAdmin = false }: ChallengeCardProps) => {
  const { address } = useSyncedWallet();
  const [data, setData] = useState<any>(project);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const { toast, promiseToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const endTime = project.project_leaderboard_enddate
      ? new Date(project.project_leaderboard_enddate).getTime()
      : new Date().getTime();

    const formatTime = (difference: number) => {
      // Calculate time units up to days
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Build time string
      const timeArray = [];
      if (days > 0) timeArray.push(`${days}d`);
      if (hours > 0) timeArray.push(`${hours}h`);
      if (minutes > 0) timeArray.push(`${minutes}min`);
      if (seconds > 0) timeArray.push(`${seconds}s`);

      return timeArray.join(' ');
    };

    if (now > endTime) {
      setIsEnded(true);
      return 'Ended';
    } else {
      setIsEnded(false);
      return 'End in ' + formatTime(endTime - now);
    }
  };

  const doSnapshoot = async (project_code: string) => {
    try {
      promiseToast(
        axios.post(
          `/api/project/snapshoot?wallet_address=${address}&project_code=${project_code}`,
          {}
        ),
        {
          loading: {
            title: 'Processing...',
            description: 'Please Wait'
          },
          success: (result) => {
            setTimeout(() => {
              window.location.reload();
            }, 3000);

            return {
              title: 'Success!',
              description: 'Stake Successfully'
            };
          },
          error: (error: AxiosResponse | any) => {
            return {
              title: 'Ups! Something wrong.',
              description:
                error?.response?.data?.message || 'Internal server error.'
            };
          }
        }
      );
    } catch (error: AxiosResponse | any) {
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      });
    }
  };

  const rules = project?.project_chellange_tierrule?.split('\\n');
  const periodes = project.project_chellange_periode?.split('\\n');
  const notes = project.project_chellange_note?.split('\\n');

  return (
    <ReactCardFlip isFlipped={isFlipped}>
      {/* Front Card */}
      <div className="flex h-[500px] w-[300px] flex-col rounded-[20px] border-2 border-[#323237] bg-neutral-900 p-4">
        <div className="flex flex-1 flex-col">
          <div className="mb-2 flex items-center gap-2">
            <div
              className={cn(
                'blinker flex h-4 w-4 items-center justify-center rounded-full',
                isEnded ? 'bg-red-500/50' : 'bg-green-500/50'
              )}
            >
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  isEnded ? 'bg-red-500' : 'bg-green-500'
                )}
              />
            </div>
            <span>{timeLeft}</span>
          </div>
          <span className="mb-2 block font-bold">{project.project_name}</span>
          <div className="relative mb-2 w-full flex-1">
            <img
              src={
                project.project_chellange_img ??
                project.project_profile_image ??
                ''
              }
              alt="Project"
              className="absolute inset-0 h-full w-full rounded-[8px] object-cover"
            />
          </div>
          <p className="mb-2 text-sm text-gray-400">
            🏆 Number of Winners:{' '}
            <span className="text-white">
              {project?.rewards ? project?.rewards.length : 0}
            </span>
          </p>
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Button
              disabled={project?.rewards?.length == 0}
              onClick={() => {
                doSnapshoot(project?.project_code ?? '-');
              }}
              className="mt-auto w-full rounded-[8px] bg-[#323237] hover:bg-[#323237]"
            >
              {(project?.rewards?.length ?? 0) > 0
                ? 'Snapshoot'
                : 'Already Snapshoot'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsFlipped(true)}
              className="mt-auto w-full rounded-[8px] bg-[#323237] hover:bg-[#323237]"
            >
              Read more
            </Button>
            <Link href={`/stake/${project.project_code}`}>
              <Button className="mt-auto w-full rounded-[8px] bg-[#323237] hover:bg-[#323237]">
                Join Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Back Card */}
      <div className="flex h-[500px] w-[300px] flex-col rounded-[20px] border-2 border-[#323237] bg-neutral-900 p-4">
        <ScrollArea className="mb-4 flex-1">
          <div className="grid gap-2">
            <div className="grid rounded-[10px] bg-[#323237] p-4">
              <span className="font-semibold text-white">TIER RULES:</span>
              {rules?.map((item, idx) => (
                <div key={idx} className="text-white">
                  {item.startsWith('-') ? (
                    <div className="pl-4 text-sm">{item}</div>
                  ) : (
                    <div className="text-sm">{item}</div>
                  )}
                </div>
              ))}
            </div>

            {periodes && (
              <div className="grid rounded-[10px] bg-[#323237] p-4">
                <span className="font-semibold text-white">
                  CHALLENGE PERIOD:
                </span>
                {periodes?.map((item, idx) => (
                  <div key={idx} className="text-white">
                    {item.startsWith('-') ? (
                      <div className="pl-4 text-sm">{item}</div>
                    ) : (
                      <div className="text-sm">{item}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {notes && (
              <div className="grid rounded-[10px] bg-[#323237] p-4">
                <span className="font-semibold text-white">NOTE:</span>
                {notes?.map((item, idx) => (
                  <div key={idx} className="text-white">
                    {item.startsWith('-') ? (
                      <div className="pl-4 text-sm">{item}</div>
                    ) : (
                      <div className="text-sm">{item}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <Button
          onClick={() => setIsFlipped(false)}
          className="mt-auto w-full rounded-[8px] bg-[#323237] hover:bg-[#323237]"
        >
          Back
        </Button>
      </div>
    </ReactCardFlip>
  );
};

export default ChallengeCard;
