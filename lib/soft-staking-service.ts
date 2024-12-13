import { fetchAllStargazeTokens } from "./utils";
import prisma from '@/prisma/prisma';

export async function updateNftOwner(address: string, collection_address: string) {
    try {
        const collection = await prisma.mst_collection.findFirst({
            where: { collection_address: collection_address },
            include: {
              mst_staker: false
            }
        });

        if (!collection) throw new Error("Collection not found");

        const staker = await prisma.mst_staker.findFirst({
            where: { 
                staker_address: address, 
                staker_collection_id: collection.collection_id 
            }
        });

        if (!staker) throw new Error("Staker not found");

        let allTokens = await fetchAllStargazeTokens({
            owner: address,
            collectionAddress: collection_address
        });
        
        const updatedStaker = await prisma.mst_staker.update({
            where: { staker_id: staker.staker_id },
            data: {
                staker_nft_staked: allTokens.length
            }
        });

        return updatedStaker;

    } catch (error) {
        console.error("Error in updateNftOwner:", error);
        throw error;
    }
}