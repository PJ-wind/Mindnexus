const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding MindNexus database...')

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mindnexus.ng' },
    update: {},
    create: {
      email: 'admin@mindnexus.ng',
      password: adminPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      adminProfile: { create: { permissions: ['ALL'] } }
    }
  })
  console.log('✅ Admin created:', admin.email)

  // Create Therapists
  const tPassword = await bcrypt.hash('therapist123', 12)

  const therapist1 = await prisma.user.upsert({
    where: { email: 'dr.adeyemi@mindnexus.ng' },
    update: {},
    create: {
      email: 'dr.adeyemi@mindnexus.ng',
      password: tPassword,
      name: 'Dr. Adeyemi',
      role: 'THERAPIST',
      phone: '+234 801 000 0001',
      therapistProfile: {
        create: {
          licenseNumber: 'NPC-2012-001',
          specialisations: ['GRIEF_BEREAVEMENT', 'ADDICTION_SUBSTANCE', 'INDIVIDUAL'],
          yearsExperience: 12,
          bio: 'Lead counselling psychologist specialising in grief and addiction recovery.',
          rating: 4.9,
          totalSessions: 134,
          isActive: true
        }
      }
    }
  })

  const therapist2 = await prisma.user.upsert({
    where: { email: 'dr.okafor@mindnexus.ng' },
    update: {},
    create: {
      email: 'dr.okafor@mindnexus.ng',
      password: tPassword,
      name: 'Dr. Okafor',
      role: 'THERAPIST',
      therapistProfile: {
        create: {
          licenseNumber: 'NPC-2016-002',
          specialisations: ['COUPLES', 'PREMARITAL', 'FAMILY_GROUP'],
          yearsExperience: 8,
          bio: 'Couples and family specialist with a focus on premarital counselling.',
          rating: 4.8,
          totalSessions: 98,
          isActive: true
        }
      }
    }
  })

  const therapist3 = await prisma.user.upsert({
    where: { email: 'dr.abara@mindnexus.ng' },
    update: {},
    create: {
      email: 'dr.abara@mindnexus.ng',
      password: tPassword,
      name: 'Dr. Abara',
      role: 'THERAPIST',
      therapistProfile: {
        create: {
          licenseNumber: 'NPC-2014-003',
          specialisations: ['CRISIS', 'INDIVIDUAL', 'REHABILITATION'],
          yearsExperience: 10,
          bio: 'Crisis intervention and trauma specialist.',
          rating: 4.7,
          totalSessions: 201,
          isActive: true
        }
      }
    }
  })
  console.log('✅ Therapists created')

  // Create Demo Client
  const clientPassword = await bcrypt.hash('client123', 12)
  const therapistProfile1 = await prisma.therapistProfile.findUnique({
    where: { userId: therapist1.id }
  })

  const client1 = await prisma.user.upsert({
    where: { email: 'amara@example.com' },
    update: {},
    create: {
      email: 'amara@example.com',
      password: clientPassword,
      name: 'Amara Musa',
      role: 'CLIENT',
      phone: '+234 802 000 0001',
      clientProfile: {
        create: {
          plan: 'STANDARD',
          counsellingArea: 'GRIEF_BEREAVEMENT',
          therapistId: therapistProfile1?.id,
          totalSessions: 16,
          completedSessions: 11,
          daysInTherapy: 42
        }
      }
    }
  })
  console.log('✅ Demo client created:', client1.email)

  const clientProfile1 = await prisma.clientProfile.findUnique({
    where: { userId: client1.id }
  })

  // Create Goals
  await prisma.goal.createMany({
    data: [
      { clientId: clientProfile1.id, title: 'Process grief and find peace with loss', progress: 65 },
      { clientId: clientProfile1.id, title: 'Improve sleep patterns and reduce insomnia', progress: 80 },
      { clientId: clientProfile1.id, title: 'Build a daily self-care and mindfulness routine', progress: 50 },
      { clientId: clientProfile1.id, title: 'Reconnect with family and support network', progress: 35 }
    ],
    skipDuplicates: true
  })

  // Create Homework
  await prisma.homeworkItem.createMany({
    data: [
      {
        clientId: clientProfile1.id,
        therapistId: therapistProfile1?.id,
        title: 'Daily mood journal entry',
        description: 'Write how you feel each morning',
        dueDate: new Date()
      },
      {
        clientId: clientProfile1.id,
        therapistId: therapistProfile1?.id,
        title: 'Breathing exercise (morning)',
        description: '5 minutes guided breathing',
        isCompleted: true,
        completedAt: new Date()
      },
      {
        clientId: clientProfile1.id,
        therapistId: therapistProfile1?.id,
        title: 'Grief letter exercise',
        description: 'Write a letter to your late mother',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ],
    skipDuplicates: true
  })

  // Create Mood Entries
  const moods = ['NEUTRAL', 'LOW', 'GOOD', 'VERY_LOW', 'GOOD', 'GOOD', 'GREAT']
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    await prisma.moodEntry.create({
      data: {
        clientId: clientProfile1.id,
        mood: moods[6 - i],
        journal: i === 0 ? 'Feeling much better today. The breathing exercises have really been helping me sleep.' : null,
        sleep: 7,
        water: 6,
        exercise: i % 2 === 0
      }
    })
  }

  // Create Resources (Psychoeducation library)
  await prisma.resource.createMany({
    data: [
      { title: 'Understanding grief stages', type: 'Article', area: 'GRIEF_BEREAVEMENT', description: 'A guide to the five stages of grief', views: 1842 },
      { title: '5-4-3-2-1 grounding technique', type: 'Exercise', area: 'CRISIS', description: 'Anxiety grounding exercise', views: 3201 },
      { title: 'Building emotional resilience', type: 'Video', description: 'Strategies for emotional strength', views: 967 },
      { title: 'Sleep hygiene for mental wellness', type: 'Guide', description: 'Improving your sleep quality', views: 2114 },
      { title: 'Self-compassion and healing', type: 'Article', area: 'GRIEF_BEREAVEMENT', description: 'Learning to be kind to yourself', views: 1456 },
      { title: 'Understanding addiction cycles', type: 'Article', area: 'ADDICTION_SUBSTANCE', description: 'How addiction affects the brain', views: 1123 }
    ],
    skipDuplicates: true
  })

  console.log('✅ Resources created')
  console.log('')
  console.log('🎉 MindNexus database seeded successfully!')
  console.log('')
  console.log('Demo accounts:')
  console.log('  Admin:     admin@mindnexus.ng     / admin123')
  console.log('  Therapist: dr.adeyemi@mindnexus.ng / therapist123')
  console.log('  Client:    amara@example.com        / client123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
