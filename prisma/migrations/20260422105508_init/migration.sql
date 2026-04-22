-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "kakao_uid" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter" (
    "id" TEXT NOT NULL,
    "sender_id" INTEGER,
    "sender_name" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "theme" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_letter" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "letter_id" TEXT NOT NULL,

    CONSTRAINT "saved_letter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_kakao_uid_key" ON "user"("kakao_uid");

-- AddForeignKey
ALTER TABLE "letter" ADD CONSTRAINT "letter_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_letter" ADD CONSTRAINT "saved_letter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_letter" ADD CONSTRAINT "saved_letter_letter_id_fkey" FOREIGN KEY ("letter_id") REFERENCES "letter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
