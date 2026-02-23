export const cleanPatchPayload = <T extends Record<string, any>>(
   formData: T, 
   originalData?: T, 
   keysToRemoveIfEmpty: (keyof T)[] = []
): Partial<T> => {
   const payloadToUpdate: Record<string, any> = {};

   if (originalData) {
      Object.keys(formData).forEach((key) => {
         if (formData[key] !== originalData[key]) {
            payloadToUpdate[key] = formData[key];
         }
      });
   } else {
      Object.assign(payloadToUpdate, formData);
   }

   keysToRemoveIfEmpty.forEach((key) => {
      const k = key as string; 
      if (payloadToUpdate[k] === "" || payloadToUpdate[k] === null || payloadToUpdate[k] === undefined) {
         delete payloadToUpdate[k];
      }
   });

   return payloadToUpdate as Partial<T>;
};