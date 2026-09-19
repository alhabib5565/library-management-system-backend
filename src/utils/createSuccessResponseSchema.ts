type TResponseOptions = {
  statusCode?: number;
  message?: string;
  meta?: boolean;
};

export const ref = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

export const array = (name: string) => ({
  type: 'array',
  items: ref(name),
});

export const createSuccessResponseSchema = (dataSchema: any, options: TResponseOptions = {}) => ({
  success: true,

  statusCode: options.statusCode ?? 200,

  message: options.message ?? 'Operation successful',
  data: dataSchema,
  ...(options.meta && {
    meta: {
      page: 1,
      limit: 10,
      total: 100,
    },
  }),
});
