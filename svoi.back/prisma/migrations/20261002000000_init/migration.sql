-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "booking";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "content";

-- CreateEnum
CREATE TYPE "booking"."booking_status" AS ENUM ('NEW', 'CONFIRMED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "content"."media" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."sections" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'home',
    "type" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "anchor" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."nav_links" (
    "id" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "sectionId" TEXT,
    "pagePath" TEXT,
    "action" TEXT,

    CONSTRAINT "nav_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."menu_filters" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "menu_filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."menu_groups" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "menu_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."menu_items" (
    "id" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."gallery_items" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "homeSortOrder" INTEGER,
    "mascotMediaId" TEXT,
    "mascotSide" TEXT,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."venue" (
    "id" TEXT NOT NULL DEFAULT 'venue',
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "descriptor" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "legal" TEXT NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking"."bookings" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT,
    "comment" TEXT,
    "status" "booking"."booking_status" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_storageKey_key" ON "content"."media"("storageKey");

-- CreateIndex
CREATE INDEX "sections_page_sortOrder_idx" ON "content"."sections"("page", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "sections_page_anchor_key" ON "content"."sections"("page", "anchor");

-- CreateIndex
CREATE INDEX "nav_links_placement_sortOrder_idx" ON "content"."nav_links"("placement", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "menu_filters_slug_key" ON "content"."menu_filters"("slug");

-- CreateIndex
CREATE INDEX "menu_items_groupId_sortOrder_idx" ON "content"."menu_items"("groupId", "sortOrder");

-- CreateIndex
CREATE INDEX "menu_items_filterId_sortOrder_idx" ON "content"."menu_items"("filterId", "sortOrder");

-- CreateIndex
CREATE INDEX "gallery_items_sortOrder_idx" ON "content"."gallery_items"("sortOrder");

-- CreateIndex
CREATE INDEX "gallery_items_showOnHome_homeSortOrder_idx" ON "content"."gallery_items"("showOnHome", "homeSortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_requestId_key" ON "booking"."bookings"("requestId");

-- CreateIndex
CREATE INDEX "bookings_status_createdAt_idx" ON "booking"."bookings"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "content"."nav_links" ADD CONSTRAINT "nav_links_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "content"."sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "menu_items_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "content"."menu_filters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "menu_items_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "content"."menu_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."menu_items" ADD CONSTRAINT "menu_items_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "content"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."gallery_items" ADD CONSTRAINT "gallery_items_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "content"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."gallery_items" ADD CONSTRAINT "gallery_items_mascotMediaId_fkey" FOREIGN KEY ("mascotMediaId") REFERENCES "content"."media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

