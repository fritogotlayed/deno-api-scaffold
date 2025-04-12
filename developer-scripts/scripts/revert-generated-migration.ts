import { join } from '@std/path';

/**
 * Check if a file exists
 * @param filePath Path to the file
 * @returns Promise<boolean> True if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(filePath);
    return stat.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Check if a file exists (synchronous version)
 * @param filePath Path to the file
 * @returns boolean True if file exists, false otherwise
 */
export function fileExistsSync(filePath: string): boolean {
  try {
    const stat = Deno.statSync(filePath);
    return stat.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error; // Re-throw other errors
  }
}

// Configuration - adjust these paths to match your project structure
const MIGRATIONS_DIR = join(Deno.cwd(), 'src', 'db', 'migrations');
// const DRIZZLE_TABLE = '_drizzle_migrations'; // Default drizzle migrations table name

type JournalFile = {
  version: string;
  dialect: string;
  entries: {
    idx: number;
    version: string;
    when: number;
    tag: string;
    breakpoints: boolean;
  }[];
};

async function revertLastMigration() {
  try {
    const promises: Promise<void>[] = [];
    let journal: JournalFile;
    let lastMigration: JournalFile['entries'][0] | undefined;

    // Check if the _journal.json exists and pull the latest migration from it
    const journalPath = join(MIGRATIONS_DIR, 'meta', '_journal.json');
    if (fileExistsSync(journalPath)) {
      journal = JSON.parse(await Deno.readTextFile(journalPath)) as JournalFile;
      if (journal.entries.length > 0) {
        lastMigration = journal.entries[journal.entries.length - 1];
      }
    } else {
      console.error('No migrations journal found.');
      Deno.exit(1);
    }

    if (!lastMigration) {
      console.error('No migrations found to revert.');
      Deno.exit(1);
    }

    // 1. Write the _journal.json file without the reverted migration
    journal.entries.pop();
    promises.push(
      Deno.writeTextFile(journalPath, JSON.stringify(journal, null, 2) + '\n'),
    );

    // 2. Delete the migration file
    const migrationPath = join(MIGRATIONS_DIR, `${lastMigration.tag}.sql`);
    promises.push(Deno.remove(migrationPath));
    console.log(`Deleted migration file: ${migrationPath}`);

    // 3. Delete the snapshot file
    const timestamp = lastMigration.tag.split('_')[0];
    const snapshotPath = join(
      MIGRATIONS_DIR,
      'meta',
      `${timestamp}_snapshot.json`,
    );
    promises.push(Deno.remove(snapshotPath));

    await Promise.all(promises);
    console.log('\nMigration successfully reverted!');
    console.log('You can now modify your schema and generate a new migration.');
  } catch (error) {
    console.error('Error reverting migration:', error);
    Deno.exit(1);
  }
}

// Run the function
await revertLastMigration();
