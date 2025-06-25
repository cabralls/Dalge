-- CreateTable
CREATE TABLE `Funcionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `referencia` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `lote` VARCHAR(191) NOT NULL,
    `validade` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produtoId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `horaFim` DATETIME(3) NOT NULL,
    `quantidadePrevista` INTEGER NOT NULL,
    `quantidadeFinal` INTEGER NOT NULL,
    `perdaVidro` INTEGER NOT NULL,
    `perdaTampa` INTEGER NOT NULL,
    `producaoLiberada` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producao` ADD CONSTRAINT `Producao_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producao` ADD CONSTRAINT `Producao_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
