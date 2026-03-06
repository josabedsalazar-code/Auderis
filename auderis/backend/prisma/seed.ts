import bcrypt from "bcrypt";
import { PrismaClient, AuditStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@auderis.local" },
    update: {},
    create: {
      email: "admin@auderis.local",
      passwordHash
    }
  });

  let demoClient = await prisma.client.findFirst({
    where: { name: "Cliente Demo" }
  });

  if (!demoClient) {
    demoClient = await prisma.client.create({
      data: {
        name: "Cliente Demo",
        taxId: "0801199912345",
        contact: "contacto@cliente-demo.com"
      }
    });
  }

  const existingAudit = await prisma.audit.findFirst({
    where: { title: "Auditoría Inicial", clientId: demoClient.id }
  });

  if (!existingAudit) {
    await prisma.audit.create({
      data: {
        title: "Auditoría Inicial",
        scope: "Procesos financieros y cumplimiento",
        status: AuditStatus.IN_PROGRESS,
        clientId: demoClient.id
      }
    });
  }

  console.log("Seed completed", { admin: admin.email, client: demoClient.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });