-- CreateTable
CREATE TABLE `PerdaInsumo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insumoId` INTEGER NOT NULL,
    `producaoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `observacao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PerdaInsumo` ADD CONSTRAINT `PerdaInsumo_insumoId_fkey` FOREIGN KEY (`insumoId`) REFERENCES `Insumo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerdaInsumo` ADD CONSTRAINT `PerdaInsumo_producaoId_fkey` FOREIGN KEY (`producaoId`) REFERENCES `Producao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
