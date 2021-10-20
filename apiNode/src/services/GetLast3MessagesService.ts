import prismaClient from "../prisma";

class GetLast3MessagesService {
    async execute() {
        const messasges = await prismaClient.message.findMany({
            take: 3,
            orderBy: {
                created_at: "desc"
            },
            include: {
                user: true
            }
        });

        return messasges;
    }
}

export { GetLast3MessagesService }