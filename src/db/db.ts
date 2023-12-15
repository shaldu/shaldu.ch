import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export function start_prisma() {
    if (prisma) return prisma;
    prisma = new PrismaClient();
}