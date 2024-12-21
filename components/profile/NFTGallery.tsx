"use client";
import { useEffect, useState } from "react";
import Gallery1 from "./Gallery1";
import Gallery2 from "./Gallery2";
import Gallery3 from "./Gallery3";
import Gallery4 from "./Gallery4";
import axios from "axios";
import getConfig from "@/config/config";
import { OwnedTokensResponse, Token } from "@/types";
import Loading from "../Loading";

export interface NFTGalleryProps {
  address: string
}

export default function NFTGallery({ address }: NFTGalleryProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(0);
  const limit = 22;
  const config = getConfig();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let resp = await axios.get(`/api/user/nfts/${address}?collection_address=${config?.collection_address}&limit=${limit}&page=${page}`)
        const data: OwnedTokensResponse = resp.data.data;
        setTokens((prev) => [...prev, ...data.tokens]);
        setHasMore(data.pageInfo.total > (page + 1) * limit);
      } catch (error) {
        console.error("Error fetching nfts data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [page]);

  const renderGallery = (tokens: Token[]) => {
    const galleries = [];
    const chunksCount = Math.ceil(tokens.length / 22);

    for (let chunk = 0; chunk < chunksCount; chunk++) {
      const startIndex = chunk * 22;
      const firstSevenTokens = tokens.slice(startIndex, startIndex + 7);
      const firstFourTokens = tokens.slice(startIndex + 7, startIndex + 11);
      const nextSevenTokens = tokens.slice(startIndex + 11, startIndex + 18);
      const nextFourTokens = tokens.slice(startIndex + 18, startIndex + 22);

      if (firstSevenTokens?.length > 0) {
        galleries.push(
          <Gallery1 
            key={`gallery1-${chunk}`} 
            tokens={firstSevenTokens} 
          />
        );
      }

      if (firstFourTokens?.length > 0) {
        galleries.push(
          <Gallery2 
            key={`gallery2-${chunk}`} 
            tokens={firstFourTokens} 
          />
        );
      }

      if (nextSevenTokens?.length > 0) {
        galleries.push(
          <Gallery3 
            key={`gallery3-${chunk}`} 
            tokens={nextSevenTokens} 
          />
        );
      }

      if (nextFourTokens?.length > 0) {
        galleries.push(
          <Gallery4 
            key={`gallery4-${chunk}`} 
            tokens={nextFourTokens} 
          />
        );
      }
    }

    return galleries;
  };

  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="px-4 md:px-24 mx-auto">
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
        {renderGallery(tokens)}
      </div>
      {loading && (
        <div className="my-6 text-center flex items-center justify-center">
          <Loading />
        </div>
      )}
      {hasMore && !loading && (
        <div className="mt-5 text-center">
          <button
            onClick={loadMore}
            className="text-[13px] md:!text-xl text-gray-400 hover:text-white"
          >
            Load More ...
          </button>
        </div>
      )}
    </div>
  );
}