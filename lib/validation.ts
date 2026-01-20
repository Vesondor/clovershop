export class ValidationError extends Error {
  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.field = field;
    this.name = "ValidationError";
  }
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateOrderData = (data: any) => {
  const errors: { field: string; message: string }[] = [];
  const validatedData = { ...data };

  // Validate required fields
  const requiredFields = [
    "name",
    "lastname",
    "email",
    "phone",
    "adress",
    "postalCode",
    "city",
    "country",
    "total",
  ];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push({
        field,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`,
      });
    }
  });

  // Validate email format
  if (data.email && !validateEmail(data.email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  // Validate total
  if (data.total !== undefined) {
    const total = parseFloat(data.total);
    if (isNaN(total) || total < 0) {
      errors.push({
        field: "total",
        message: "Total must be a positive number",
      });
    } else {
      validatedData.total = total;
    }
  }

  // Set default status if not provided
  if (!validatedData.status) {
    validatedData.status = "Processing";
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData,
  };
};
