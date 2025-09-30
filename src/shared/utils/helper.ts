import axios from 'axios';
import { IPaginationMeta } from '../interfaces';

export function generatePaginationMeta(
  page: number,
  limit: number,
  total: number,
): IPaginationMeta {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function sanitizeData(data: any) {
  const { password, __v, ...sanitizedData } = JSON.parse(JSON.stringify(data));
  if (sanitizedData._id) {
    sanitizedData.id = sanitizedData._id.toString();
    delete sanitizedData._id;
  }
  return sanitizedData;
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

export async function formatCountryCode(country: string, API_NINJAS_API_KEY: string): Promise<string> {
  let url = `https://api.api-ninjas.com/v1/country?name=${country}`;
  let options = {
    headers: {
      'X-Api-Key': API_NINJAS_API_KEY
    }
  };
  let response = await axios.get(url, options);
  return response.data[0].iso2;
}