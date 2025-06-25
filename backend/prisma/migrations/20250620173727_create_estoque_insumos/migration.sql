-- CreateTable
CREATE TABLE `Insumo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EstoqueInsumo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insumoId` INTEGER NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EstoqueInsumo_insumoId_key`(`insumoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimentacaoEstoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insumoId` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `quantidade` DOUBLE NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacao` VARCHAR(191) NULL,
    `producaoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EstoqueInsumo` ADD CONSTRAINT `EstoqueInsumo_insumoId_fkey` FOREIGN KEY (`insumoId`) REFERENCES `Insumo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_insumoId_fkey` FOREIGN KEY (`insumoId`) REFERENCES `Insumo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_producaoId_fkey` FOREIGN KEY (`producaoId`) REFERENCES `Producao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
