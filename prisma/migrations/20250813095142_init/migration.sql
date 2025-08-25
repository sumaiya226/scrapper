-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "aadhaarNumber" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);
