'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

// export type State = {
//   errors?: {
//     customerId?: string[];
//     amount?: string[];
//     status?: string[];
//   };
//   message?: string | null;
// };

const Invoice = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
const CreateInvoice = Invoice.omit({ id: true, date: true });
const UpdateInvoice = Invoice.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id,amount,status,date) 
    VALUES (${customerId},${amountInCents}, ${status}, ${date})`;
    // revalidatePath('/ui/dashboard/invoices');
    // redirect('/ui/dashboard/invoices');
  } catch (error) {
    console.log('createInvoice ERR: ', error);
  }
  revalidatePath('/ui/dashboard/invoices');
  redirect('/ui/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Prepare data for insertion into the database
  const finalAmount = amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId},amount = ${finalAmount},status=${status}
      WHERE id=${id}
      `;
    // revalidatePath('/ui/dashboard/invoices');
    // redirect('/ui/dashboard/invoices');
  } catch (error) {
    console.log('updateInvoice ERR : ', error);
  }
  revalidatePath('/ui/dashboard/invoices');
  redirect('/ui/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices
      WHERE  id=${id}
      `;
  } catch (error) {
    console.log('deleteInvoice ERR : ', error);
  }
  revalidatePath('/ui/dashboard/invoices');
}
