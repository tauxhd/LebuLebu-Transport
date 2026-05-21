import sql from "./db";

export async function setupDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pricing (
      id SERIAL PRIMARY KEY,
      service TEXT UNIQUE NOT NULL,
      config JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Default bus pricing
  await sql`
    INSERT INTO pricing (service, config) VALUES (
      'bus',
      ${JSON.stringify({
        baseRatePerBusPerDay: 250,
        extraHourlyRate: 30,
        maxBuses: 20,
        maxHoursPerDay: 24,
        minHoursPerDay: 4,
        maxDaysPerWeek: 7,
        yearlyDiscount: 0.10,
        routeMultipliers: {
          standard: 1,
          extended: 1.3,
          remote: 1.6
        }
      })}
    )
    ON CONFLICT (service) DO NOTHING
  `;

  // Default garbage pricing
  await sql`
    INSERT INTO pricing (service, config) VALUES (
      'garbage',
      ${JSON.stringify({
        baseRatePerTruckPerWeek: 400,
        maxTrucks: 10,
        maxCollectionsPerWeek: 7,
        yearlyDiscount: 0.10,
        volumeMultipliers: {
          small: 1,
          medium: 1.5,
          large: 2.2
        },
        typeMultipliers: {
          general: 1,
          mixed: 1.4,
          hazardous: 1.8
        }
      })}
    )
    ON CONFLICT (service) DO NOTHING
  `;

  // Default excavation pricing
  await sql`
    INSERT INTO pricing (service, config) VALUES (
      'excavation',
      ${JSON.stringify({
        extraHourlyRate: 50,
        maxUnits: 8,
        maxHoursPerDay: 24,
        minHoursPerDay: 4,
        maxDays: 30,
        operatorMultiplier: 1.2,
        yearlyDiscount: 0.10,
        equipmentRates: {
          excavator_standard: 800,
          excavator_large: 1200,
          backhoe: 600,
          bulldozer: 500,
          compactor: 400
        }
      })}
    )
    ON CONFLICT (service) DO NOTHING
  `;

  console.log("Database setup complete");
}