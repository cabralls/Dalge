/*
  Warnings:

  - You are about to drop the column `data` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `horaFim` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `horaInicio` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `perdaTampa` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `perdaVidro` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `producaoLiberada` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeFinal` on the `producao` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadePrevista` on the `producao` table. All the data in the column will be lost.
  - Added the required column `inicio` to the `Producao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liderId` to the `Producao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `producao` DROP COLUMN `data`,
    DROP COLUMN `horaFim`,
    DROP COLUMN `horaInicio`,
    DROP COLUMN `perdaTampa`,
    DROP COLUMN `perdaVidro`,
    DROP COLUMN `producaoLiberada`,
    DROP COLUMN `quantidadeFinal`,
    DROP COLUMN `quantidadePrevista`,
    ADD COLUMN `fim` DATETIME(3) NULL,
    ADD COLUMN `inicio` DATETIME(3) NOT NULL,
    ADD COLUMN `liderFinalizouId` INTEGER NULL,
    ADD COLUMN `liderId` INTEGER NOT NULL,
    ADD COLUMN `observacoes` VARCHAR(191) NULL,
    ADD COLUMN `observacoesFinais` VARCHAR(191) NULL,
    ADD COLUMN `rotulo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivel_acesso` VARCHAR(191) NOT NULL DEFAULT 'FUNCIONARIO',

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EtapaProducao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `producaoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producao` ADD CONSTRAINT `Producao_liderId_fkey` FOREIGN KEY (`liderId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producao` ADD CONSTRAINT `Producao_liderFinalizouId_fkey` FOREIGN KEY (`liderFinalizouId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EtapaProducao` ADD CONSTRAINT `EtapaProducao_producaoId_fkey` FOREIGN KEY (`producaoId`) REFERENCES `Producao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
