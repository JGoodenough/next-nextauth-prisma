-- CreateTable
CREATE TABLE "UserFavoriteHomes" (
    "userId" TEXT NOT NULL,
    "homeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavoriteHomes_pkey" PRIMARY KEY ("userId","homeId")
);

-- AddForeignKey
ALTER TABLE "UserFavoriteHomes" ADD CONSTRAINT "UserFavoriteHomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteHomes" ADD CONSTRAINT "UserFavoriteHomes_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
