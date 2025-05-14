-- CreateTable
CREATE TABLE "Recherche" (
    "id" SERIAL NOT NULL,
    "siteId" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "motCle" TEXT,
    "dateRecherche" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombreResultats" INTEGER NOT NULL,
    "dureeMs" INTEGER NOT NULL,

    CONSTRAINT "Recherche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produit" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "image" TEXT,
    "disponibilite" TEXT,
    "categorie" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "dateScraping" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rechercheId" INTEGER NOT NULL,

    CONSTRAINT "Produit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produit_url_key" ON "Produit"("url");

-- AddForeignKey
ALTER TABLE "Produit" ADD CONSTRAINT "Produit_rechercheId_fkey" FOREIGN KEY ("rechercheId") REFERENCES "Recherche"("id") ON DELETE CASCADE ON UPDATE CASCADE;
