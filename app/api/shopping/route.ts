import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.all('SELECT * FROM shopping_items ORDER BY created_at DESC');
    return NextResponse.json(items);
  } catch (error) {
    console.error('Database error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to fetch items: ${errorMessage}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const id = randomUUID();
    const db = await getDb();
    
    await db.run(
      'INSERT INTO shopping_items (id, title, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [id, title]
    );
    
    const item = await db.get('SELECT * FROM shopping_items WHERE id = ?', [id]);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Database error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: `Failed to create item: ${errorMessage}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, completed } = await request.json();
    const db = await getDb();
    
    await db.run(
      'UPDATE shopping_items SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [completed ? 1 : 0, id]
    );
    
    const item = await db.get('SELECT * FROM shopping_items WHERE id = ?', [id]);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDb();
    
    await db.run('DELETE FROM shopping_items WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}