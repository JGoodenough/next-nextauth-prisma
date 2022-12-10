/*
  Warnings:

  - Added the required column `userId` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" ADD COLUMN "userId" TEXT;

/* UpdateData - Add default owner value to existing homes */
UPDATE "Home" SET "userId" = 'clbfehqqq0000pzp8csqrwry9' WHERE "userId" IS NULL;

/* AlterColumn - Change ownerId to a required column */
ALTER TABLE "Home" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;