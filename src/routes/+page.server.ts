import type { Actions } from './$types';
import type { CustomSession } from '$lib/stores';
import { prisma } from '$db/db';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const actions = {
    createCollection: async (event) => {
        const formData = await event.request.formData();
        const collectionName = formData.get('title') as string;
        const session = await event.locals.getSession() as CustomSession;
        const accountId = session.account.id;

        //between 3 and 32 characters
        if (!collectionName || collectionName.length < 3 || collectionName.length > 32) {
            return {
                status: 400,
                body: {
                    message: 'Collection creation failed',
                    caption: 'Collection name must be between 3 and 32 characters.',
                }
            }
        }

        const collection = await prisma.learnCollection.create({
            data: {
                title: collectionName as string,
                account: {
                    connect: {
                        id: accountId
                    }
                }
            }
        });

        if (!collection) {
            return {
                status: 500,
                body: {
                    message: 'Collection creation failed',
                    caption: 'Something went wrong, please try again later.'
                }
            }
        } else {
            return {
                status: 200,
                body: {
                    message: ``,
                    caption: `Collection ${collectionName} created !`
                }
            }
        }
    },
    createFileCollection: async (event) => {
        const data = Object.fromEntries(await event.request.formData())

        const session = await event.locals.getSession() as CustomSession;
        const accountId = session.account.id as string;

        const collectionId = data.collectionId as string;
        const fileName = data.fileTitle as string;
        const file = data.fileUpload as File;

        //between 3 and 32 characters
        if (!fileName || fileName.length < 3 || fileName.length > 32) {
            return {
                status: 400,
                body: {
                    message: 'File creation failed',
                    caption: 'File name must be between 3 and 32 characters.',
                    collectionId
                }
            }
        }

        const filenNameCleaned = fileName.replace(/[^a-zA-Z0-9]/g, '_');

        const crpytoUrl = crypto.randomUUID() as string
        const filePathUrl = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'media',
            'files',
            crpytoUrl,
        )
        const filePath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'static',
            'media',
            'files',
            crpytoUrl,
        )

        fs.mkdirSync(path.dirname(filePath + "/filler"), { recursive: true  });
        let fileNamePath = `${filePath}/${filenNameCleaned}.pdf`;
        let fileNamePathUrl = `${filePathUrl}/${filenNameCleaned}.pdf`;
        await writeFile(fileNamePath, file.stream());
        
        //split  process.cwd() to get the relative path to the media folder
        fileNamePathUrl = fileNamePathUrl.split(process.cwd())[1];
        
        const fileCollection = await prisma.pdfFile.create({
            data: {
                title: fileName as string,
                accountId: accountId,
                path: fileNamePathUrl,
                progress: 0,
                learnCollection: {
                    connect: {
                        id: collectionId
                    }
                }
            }
        });

        if (!fileCollection) {
            return {
                status: 500,
                body: {
                    message: 'File creation failed',
                    caption: 'Something went wrong, please try again later.',
                    collectionId
                }
            }
        } else {
            return {
                status: 200,
                body: {
                    message: ``,
                    caption: `PDF '${fileName}' uploaded !`,
                    collectionId
                }
            }
        }

    }
} as Actions