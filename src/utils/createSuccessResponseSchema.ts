export const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
export const array = (name: string) => ({
  type: 'array',
  items: ref(name),
});

console.log('arra', ref('Category'));

export const createSuccessResponseSchema = (dataSchema, withMeta = false) => ({
  success: true,
  statusCode: 200,
  message: 'Operation successful',
  data: dataSchema,
  ...(withMeta && {
    meta: {
      page: 1,
      limit: 10,
      total: 100,
    },
  }),
});
