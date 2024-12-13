-- CreateTable
CREATE TABLE "mst_users" (
    "user_address" TEXT NOT NULL,
    "user_discord_url" TEXT,
    "user_twitter_url" TEXT,
    "user_image_url" TEXT,
    "user_created_date" TIMESTAMP(3),

    CONSTRAINT "mst_users_pkey" PRIMARY KEY ("user_address")
);

-- AddForeignKey
ALTER TABLE "mst_staker" ADD CONSTRAINT "mst_staker_staker_address_fkey" FOREIGN KEY ("staker_address") REFERENCES "mst_users"("user_address") ON DELETE SET NULL ON UPDATE CASCADE;
