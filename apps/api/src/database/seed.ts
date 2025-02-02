import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.professional.deleteMany({});

  // Sample data array
  const professionals = [
    {
      type: 'Organization',
      orgPracId: '1234567',
      usernameUrl: 'hospital1_url',
      name: 'Hospital 1',
      ranking: 10,
      photo: 'https://example.com/hospital1.jpg',
      category: 'Healthcare',
      subCategories: ['Medicine', 'Eye'],
      rating: 4.7,
      totalAppointment: 1000,
      zones: ['Cal', 'Nev', 'NY'],
      branches: ['branch 1', 'Branch 2'],
      areaOfPractice: 'local',
    },
    {
      type: 'Organization',
      orgPracId: '7654321',
      usernameUrl: 'hospital2_url',
      name: 'Hospital 2',
      ranking: 8,
      photo: 'https://example.com/hospital2.jpg',
      category: 'Healthcare',
      subCategories: ['Dentistry', 'Pediatrics'],
      rating: 4.5,
      totalAppointment: 850,
      zones: ['Cal', 'Tex'],
      branches: ['Main Branch', 'Downtown Branch'],
      areaOfPractice: 'regional',
    },
    {
      type: 'Organization',
      orgPracId: '9876543',
      usernameUrl: 'clinic1_url',
      name: 'Specialty Clinic 1',
      ranking: 9,
      photo: 'https://example.com/clinic1.jpg',
      category: 'Healthcare',
      subCategories: ['Cardiology', 'Internal Medicine'],
      rating: 4.8,
      totalAppointment: 1200,
      zones: ['NY', 'NJ'],
      branches: ['Manhattan', 'Brooklyn'],
      areaOfPractice: 'local',
    },
  ];

  // Create records
  for (const professional of professionals) {
    await prisma.professional.create({
      data: professional,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
