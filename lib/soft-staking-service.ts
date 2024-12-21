import { mst_attributes_reward } from "@prisma/client";
import calculatePoint, { fetchAllStargazeTokens } from "./utils";
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


export async function getTotalPoints(address: string, collection_address: string){

    const collection = await prisma.mst_collection.findFirst({
        where: { collection_address: collection_address },
        include: {
            mst_staker: false
        }
    });

    if (!collection) {
        throw Error("Collection not found")
    }

    const staker = await prisma.mst_staker.findFirst({
        where: { staker_address: address, staker_collection_id: collection.collection_id }
    })

    if (!staker) {
        throw Error("Staker not found");
    }

    const attributes_rewards = await prisma.mst_attributes_reward.findMany({
        where: { attr_collection_id: collection.collection_id }
    });

    let allTokens = await fetchAllStargazeTokens({
        owner: address,
        collectionAddress: collection_address,
        filterForSale: 'UNLISTED'
    });

    let attrreward: mst_attributes_reward[] = [];
    allTokens.forEach((nft) => {
        nft.traits.forEach(trait => {
            const matchingReward = attributes_rewards.find(reward => 
                reward.attr_key == trait.name && 
                reward.attr_val == trait.value
            );
            
            if (matchingReward) {
                attrreward.push(matchingReward);
            }
        });
    });

    console.log("attrreward", attrreward.length);

    const totalPoints = attrreward?.reduce((sum, reward) => 
        sum + calculatePoint(reward, staker.staker_lastclaim_date), 0
    );

    return  {
        totalNft: allTokens.length,
        point: totalPoints
    };
}