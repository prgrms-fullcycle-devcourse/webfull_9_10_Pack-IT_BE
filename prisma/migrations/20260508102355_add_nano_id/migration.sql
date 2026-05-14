-- migration.sql 내용
ALTER TABLE "letter" ADD COLUMN "password" TEXT;

ALTER TABLE "user" 
  ADD COLUMN "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "nano_id" TEXT,
  ADD COLUMN "user_type" TEXT,
  ALTER COLUMN "email" DROP NOT NULL,
  ALTER COLUMN "kakao_uid" DROP NOT NULL,
  ALTER COLUMN "nickname" DROP NOT NULL;

CREATE UNIQUE INDEX "user_nano_id_key" ON "user"("nano_id");