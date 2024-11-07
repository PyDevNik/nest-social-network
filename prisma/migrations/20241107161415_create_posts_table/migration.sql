-- CreateEnum
CREATE TYPE "PostPrivacyEnum" AS ENUM ('onlyUser', 'onlyFriends', 'everyone');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "PostPrivacyEnum" NOT NULL DEFAULT 'everyone',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
