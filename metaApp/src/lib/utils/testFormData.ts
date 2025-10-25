import { Platform } from 'react-native';

// region Test Form Data
export const testFormData = () => {
  console.log('=== TESTING FORMDATA ===');
  console.log('Platform:', Platform.OS);

  const formData = new FormData();
  formData.append('content', 'Test post content');
  formData.append('test', 'test value');

  console.log('FormData created:', formData);
  console.log('FormData type:', typeof formData);
  console.log('Is FormData instance:', formData instanceof FormData);

  // Check available methods and properties
  console.log('FormData methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(formData)));
  console.log('FormData properties:', Object.keys(formData));

  // Try to access _parts if it exists
  if ((formData as any)._parts) {
    console.log('_parts found:', (formData as any)._parts);
  }

  // Try to access _data if it exists
  if ((formData as any)._data) {
    console.log('_data found:', (formData as any)._data);
  }

  console.log('=== END TEST ===');

  return formData;
};
