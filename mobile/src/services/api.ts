import * as FileSystem from 'expo-file-system';

export interface FileItem { id: string; name: string }

const backendUrl = 'http://localhost:3000';

export async function uploadFile(name: string, data: string): Promise<void> {
  await fetch(`${backendUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data })
  });
}

export async function listFiles(): Promise<FileItem[]> {
  const resp = await fetch(`${backendUrl}/files`);
  return resp.json();
}

export async function downloadFile(id: string): Promise<{ content: string }> {
  const resp = await fetch(`${backendUrl}/download/${id}`);
  return resp.json();
}

export async function saveFile(name: string, base64: string): Promise<string> {
  const path = `${FileSystem.documentDirectory}${name}`;
  await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
  return path;
}
