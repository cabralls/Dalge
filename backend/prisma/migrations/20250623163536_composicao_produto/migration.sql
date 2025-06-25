-- CreateTable
CREATE TABLE `ComposicaoProduto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `produtoId` INTEGER NOT NULL,
    `insumoId` INTEGER NOT NULL,
    `quantidade` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ComposicaoProduto` ADD CONSTRAINT `ComposicaoProduto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComposicaoProduto` ADD CONSTRAINT `ComposicaoProduto_insumoId_fkey` FOREIGN KEY (`insumoId`) REFERENCES `Insumo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
