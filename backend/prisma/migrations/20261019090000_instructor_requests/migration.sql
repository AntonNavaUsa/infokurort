-- CreateTable
CREATE TABLE "instructor_requests" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "contact" VARCHAR(100) NOT NULL,
    "resort" VARCHAR(50) NOT NULL,
    "dates" VARCHAR(100),
    "learner" VARCHAR(30) NOT NULL,
    "child_age" VARCHAR(30),
    "discipline" VARCHAR(30) NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "page" VARCHAR(200),
    "attribution" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instructor_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "instructor_requests_created_at_idx" ON "instructor_requests"("created_at");

-- CreateIndex
CREATE INDEX "instructor_requests_status_idx" ON "instructor_requests"("status");
