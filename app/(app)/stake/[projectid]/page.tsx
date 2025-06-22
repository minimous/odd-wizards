'use client';
import Header from '@/components/layout/header';
import CustomGradualSpacing from '@/components/CustomGradouselSpacing';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/layout/footer';
import StakeSection from '@/components/home/StakeSection';
import axios from 'axios';
import { mst_project } from '@prisma/client';
import MultipleStakeSection from '@/components/home/MultipleStakeSection';
import Loading from '@/components/Loading';

export default function Stake({ params }: { params: { projectid: string } }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isMultiCollection, setIsMultiCollection] = useState<boolean>(false);
  const [project, setProject] = useState<any | undefined>();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let resp = await axios.get(`/api/project/${params.projectid}`);
      const respProject = resp.data.data ?? undefined;
      setProject(respProject);
      setIsMultiCollection(respProject?.collections?.length > 1);
      setLoading(false);
    }

    fetchData();
  }, []);

  const renderBanner = () => {
    if (project?.project_banner_type === 'V') {
      return (
        <video
          autoPlay
          loop
          playsInline
          muted
          className="h-full w-full scale-125"
        >
          <source src={project?.project_banner} type="video/mp4" />
        </video>
      );
    } else {
      return (
        <div
          className="h-full w-full bg-cover"
          style={{
            backgroundImage: `url('${
              project?.project_banner ?? '/images/stake/banner-odds-mobile.png'
            }')`
          }}
        />
      );
    }
  };

  return (
    <div className="relative w-full bg-black">
      <HeaderV2 />
      <div className="relative h-[175px] w-full overflow-hidden bg-black md:h-[70vh]">
        <div className="absolute top-0 z-10 h-[100px] w-full bg-gradient-to-b from-black to-transparent md:h-[250px]" />
        <div className="absolute bottom-0 z-10 h-[100px] w-full bg-gradient-to-b from-transparent to-black md:h-[250px]" />
        {renderBanner()}
      </div>
      <div className="relative">
        <div
          style={{
            backgroundImage: `url('${project?.project_profile_image}')`
          }}
          className="absolute -top-14 left-1/2 z-20 h-[100px] w-[100px] -translate-x-1/2 transform rounded-full bg-cover bg-center md:!-top-24 md:h-[175px] md:w-[175px]"
        />
      </div>
      <div className="mt-14 flex flex-col items-center justify-center px-5 md:!mt-28 md:px-20">
        <CustomGradualSpacing
          className="font-display text-center text-4xl font-black md:!text-6xl md:leading-[5rem]"
          text={project?.project_name ?? ''}
        />
        <div className="mb-6 mt-2 px-5 md:mb-10 md:mt-4 md:px-32">
          <p className="text-center text-sm leading-none text-gray-400 md:!text-xl">
            {project?.project_description}
          </p>
        </div>
      </div>
      {loading ? (
        <div className="mt-10 flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="relative">
          {isMultiCollection ? (
            <MultipleStakeSection
              project={project}
              collections={project?.collections ?? []}
              rewards={project?.rewards}
              projectid={params.projectid}
            />
          ) : (
            project?.collections[0] && (
              <StakeSection
                rewards={project?.rewards}
                project={project}
                collection={project?.collections[0]}
                projectid={params.projectid}
              />
            )
          )}
        </div>
      )}
      <div className="h-full bg-[url('/images/bg-line-grid.png')] bg-cover bg-center py-12 md:py-16">
        <Footer
          twitterUrl={project?.project_twitter_url}
          discordUrl={project?.project_discord_url}
          discordImage={project?.project_footer_discord}
          twitterImage={project?.project_footer_twitter}
          className="my-0"
        />
      </div>
    </div>
  );
}
