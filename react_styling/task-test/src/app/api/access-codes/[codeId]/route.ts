import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { accessCode } from '@/db/appSchema';
import { eq } from 'drizzle-orm';
import { errorHandler } from '@/utils/api/errorHandler';

export async function DELETE(request: Request, { params: { codeId } }: { params: { codeId: string } }) {
  try {
    await db.delete(accessCode)
      .where(eq(accessCode.access_code_id, Number(codeId)));
    return NextResponse.json({ message: "Code d'accès supprimé avec succès" });
  } catch (error) {
    return errorHandler(error);
  }
}
