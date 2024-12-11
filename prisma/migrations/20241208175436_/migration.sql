-- CreateTable
CREATE TABLE "mst_collection" (
    "collection_id" SERIAL NOT NULL,
    "collection_address" TEXT,
    "collection_name" TEXT,
    "collection_description" TEXT,
    "collection_supply" INTEGER,

    CONSTRAINT "mst_collection_pkey" PRIMARY KEY ("collection_id")
);

-- CreateTable
CREATE TABLE "mst_staker" (
    "staker_id" SERIAL NOT NULL,
    "staker_address" TEXT,
    "staker_collection_id" INTEGER,
    "staker_lastclaim_date" TIMESTAMP(3),
    "staker_nft_staked" INTEGER,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3),

    CONSTRAINT "mst_staker_pkey" PRIMARY KEY ("staker_id")
);

-- CreateTable
CREATE TABLE "trn_point" (
    "point_id" SERIAL NOT NULL,
    "point_amount" INTEGER,
    "point_claim_date" TIMESTAMP(3),
    "point_nft_staked" INTEGER,
    "point_staker_id" INTEGER,

    CONSTRAINT "trn_point_pkey" PRIMARY KEY ("point_id")
);

-- CreateTable
CREATE TABLE "mst_attributes_reward" (
    "attr_id" SERIAL NOT NULL,
    "attr_key" TEXT,
    "attr_val" TEXT,
    "attr_reward" INTEGER,
    "attr_periode" TEXT,
    "attr_collection_id" INTEGER,

    CONSTRAINT "mst_attributes_reward_pkey" PRIMARY KEY ("attr_id")
);

-- AddForeignKey
ALTER TABLE "mst_staker" ADD CONSTRAINT "mst_staker_staker_collection_id_fkey" FOREIGN KEY ("staker_collection_id") REFERENCES "mst_collection"("collection_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trn_point" ADD CONSTRAINT "trn_point_point_staker_id_fkey" FOREIGN KEY ("point_staker_id") REFERENCES "mst_staker"("staker_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_attributes_reward" ADD CONSTRAINT "mst_attributes_reward_attr_collection_id_fkey" FOREIGN KEY ("attr_collection_id") REFERENCES "mst_collection"("collection_id") ON DELETE SET NULL ON UPDATE CASCADE;
