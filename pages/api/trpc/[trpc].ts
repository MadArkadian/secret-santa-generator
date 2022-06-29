import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { prisma } from "../../../db/client";

export const appRouter = trpc
    .router()
    .query("getReceiver", {
        input: z.object({
            key: z.string(),
            giver: z.string(),
        }),
        async resolve({ input }) {
            const { key, giver } = input;
            const receiver = await prisma.group.findFirst({
                where: {
                    key,
                    giver,
                }
            });
            return receiver;
        },
    })
    .mutation("addPerson", {
        input: z.object({
            key: z.string(),
            giver: z.string(),
            receiver: z.string(),
        }),
        async resolve({ input }) {
            try {
                const { key, giver, receiver } = input;
                const group = await prisma.group.create({
                    data: {
                        key,
                        giver,
                        receiver,
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => null,
});