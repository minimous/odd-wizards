'use client';
import Header from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { mst_project } from '@prisma/client';
import axios from 'axios';
import ChallengeCard from '@/components/challenge/ChallengeCard';
import Loading from '@/components/Loading';
import getConfig from '@/config/config';
import { useChain } from '@cosmos-kit/react';

interface projectType extends mst_project {
  rewards?: any[];
}

const config = getConfig();
export default function About() {
  const { address, isWalletConnecting, isWalletConnected } =
    useChain('stargaze');
  const [loading, setLoading] = useState<boolean>(true);
  const [challenges, setChallenges] = useState<projectType[] | []>([]);

  useEffect(() => {
    if (config && address && !config.owners.includes(address)) {
      window.location.href = '/challenge';
    }
  }, [address]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resp = await axios.get(
        `/api/project/challenge?t=${new Date().getTime()}`
      );
      setChallenges(resp.data.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[url('/images/Cosmos.gif')] bg-cover bg-center">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-0 bg-black/50" />
      <HeaderV2 />
      <div className="relative pt-28">
        <h1 className="text-center text-5xl font-black">Challenges</h1>
        {loading ? (
          <div className="mt-10 flex justify-center">
            <Loading />
          </div>
        ) : (
          <div className="my-10 px-32">
            <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-3">
              <div className="col-span-full flex flex-wrap justify-center gap-8">
                {challenges.map((project, index) => {
                  return (
                    <ChallengeCard
                      key={index}
                      project={project}
                      isAdmin={true}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer className="my-0 py-8 md:!my-0" />
    </div>
  );
}
