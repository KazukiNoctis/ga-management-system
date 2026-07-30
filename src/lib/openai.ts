import { supabase } from './supabase';
import { CheckingForm } from '../types';

export async function generateGASummary(forms: CheckingForm[]): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-report', {
      body: { forms }
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (data?.error) {
      throw new Error(`Report generation failed: ${data.error}`);
    }

    return data.report;
  } catch (error) {
    console.error('Error generating GA summary:', error);
    throw error;
  }
}
