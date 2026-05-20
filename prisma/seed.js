const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    await prisma.pageVisit.deleteMany();
    await prisma.product.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();
    await prisma.optionSet.deleteMany();
    await prisma.specGroup.deleteMany();
    await prisma.user.deleteMany();

    const [colorOptionSet, storageOptionSet] = await Promise.all([
        prisma.optionSet.create({
            data: {
                name: "Color",
                type: "COLOR",
                options: [
                    { name: "Space Black", value: "#1f1f23" },
                    { name: "Silver", value: "#c0c0c8" },
                    { name: "Cosmic Purple", value: "#6f4bbd" },
                ],
            },
        }),
        prisma.optionSet.create({
            data: {
                name: "Storage",
                type: "TEXT",
                options: [
                    { name: "128 GB", value: "128" },
                    { name: "256 GB", value: "256" },
                    { name: "512 GB", value: "512" },
                ],
            },
        }),
    ]);

    const [displaySpecGroup, performanceSpecGroup] = await Promise.all([
        prisma.specGroup.create({
            data: {
                title: "Display",
                specs: ["6.5 inch OLED", "120Hz refresh rate", "HDR10+"],
            },
        }),
        prisma.specGroup.create({
            data: {
                title: "Performance",
                specs: ["8-core CPU", "12 GB RAM", "Wi-Fi 7"],
            },
        }),
    ]);

    const [smartphonesCategory, laptopsCategory] = await Promise.all([
        prisma.category.create({
            data: {
                name: "Smartphones",
                url: "smartphones",
                iconSize: [24, 24],
                Category_Option: {
                    create: [
                        { option: { connect: { id: colorOptionSet.id } } },
                        { option: { connect: { id: storageOptionSet.id } } },
                    ],
                },
                Category_SpecGroup: {
                    create: [
                        { specGroup: { connect: { id: displaySpecGroup.id } } },
                        { specGroup: { connect: { id: performanceSpecGroup.id } } },
                    ],
                },
            },
        }),
        prisma.category.create({
            data: {
                name: "Laptops",
                url: "laptops",
                iconSize: [32, 32],
                Category_Option: {
                    create: [
                        { option: { connect: { id: colorOptionSet.id } } },
                        { option: { connect: { id: storageOptionSet.id } } },
                    ],
                },
                Category_SpecGroup: {
                    create: [
                        { specGroup: { connect: { id: displaySpecGroup.id } } },
                        { specGroup: { connect: { id: performanceSpecGroup.id } } },
                    ],
                },
            },
        }),
    ]);

    const [brandBitex, brandNovaTech] = await Promise.all([
        prisma.brand.create({ data: { name: "Bitex" } }),
        prisma.brand.create({ data: { name: "NovaTech" } }),
    ]);

    await prisma.product.create({
        data: {
            name: "Bitex Ultra 5G",
            desc: "A premium smartphone with excellent battery life, vivid OLED screen, and fast charging.",
            isAvailable: true,
            specialFeatures: { set: ["5G", "Fast charging", "Water resistant"] },
            images: {
                set: [
                    "/images/products/phone-1.png",
                    "/images/products/phone-2.png",
                ]
            },
            category: { connect: { id: smartphonesCategory.id } },
            optionSets: { set: [colorOptionSet.id, storageOptionSet.id] },
            price: 999.99,
            salePrice: 899.99,
            specs: [
                {
                    specGroupID: displaySpecGroup.id,
                    specValues: ["6.7 inch OLED", "120Hz", "HDR10+"],
                },
                {
                    specGroupID: performanceSpecGroup.id,
                    specValues: ["8-core CPU", "12 GB RAM", "Wi-Fi 7"],
                },
            ],
            brand: { connect: { id: brandBitex.id } },
        },
    });

    await prisma.product.create({
        data: {
            name: "NovaTech Stealth Laptop",
            desc: "A sleek laptop built for creators, with a powerful processor and long-lasting battery.",
            isAvailable: true,
            specialFeatures: { set: ["Lightweight", "Thunderbolt 4", "Retina-like display"] },
            images: {
                set: [
                    "/images/products/laptop-1.png",
                    "/images/products/laptop-2.png",
                ]
            },
            category: { connect: { id: laptopsCategory.id } },
            optionSets: { set: [colorOptionSet.id, storageOptionSet.id] },
            price: 1499.99,
            salePrice: 1299.99,
            specs: [
                {
                    specGroupID: displaySpecGroup.id,
                    specValues: ["15.6 inch IPS", "120Hz", "Anti-glare"],
                },
                {
                    specGroupID: performanceSpecGroup.id,
                    specValues: ["12-core CPU", "16 GB RAM", "Wi-Fi 7"],
                },
            ],
            brand: { connect: { id: brandNovaTech.id } },
        },
    });

    await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@bitex.com",
            hashedPassword: "admin123",
        },
    });

    console.log("Database seeding completed.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
